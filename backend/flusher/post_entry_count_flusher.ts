import redis = require("redis");
import { Reaction } from "../../interface/post_entry";
import { LOGGER } from "../common/logger";
import { REDIS_CLIENTS } from "../common/redis_clients";
import { POSTS_DATABASE, POST_ENTRY_TABLE } from "../common/spanner_database";
import { Database, Table } from "@google-cloud/spanner";
import { Json } from "@google-cloud/spanner/build/src/codec";
import { Row } from "@google-cloud/spanner/build/src/partial-result-stream";

export class PostEntryCounterFlusher {
  private static SHARDS_PER_REDIS_CLIENT = ["1", "2"];
  private static CYCLE_INTERVAL = 60000; // ms

  public constructor(
    private redisClients: Array<[string, redis.RedisClientType]>,
    private postsDatabase: Database,
    private postEntriesTable: Table,
    private setTimeout: (handler: TimerHandler, timeout: number) => void,
    private getNow: () => number
  ) {}

  public static create(): PostEntryCounterFlusher {
    return new PostEntryCounterFlusher(
      REDIS_CLIENTS,
      POSTS_DATABASE,
      POST_ENTRY_TABLE,
      setTimeout,
      () => Date.now()
    ).init();
  }

  public init(): this {
    this.setTimeout(() => this.flushCounters(), 0);
    return this;
  }

  private async flushCounters(): Promise<void> {
    let flushPromises = new Array<Promise<void>>();
    for (let clientPair of this.redisClients) {
      for (let shard of PostEntryCounterFlusher.SHARDS_PER_REDIS_CLIENT) {
        flushPromises.push(this.flushOneShard(clientPair, shard));
      }
    }
    try {
      await Promise.all(flushPromises);
    } catch (e) {
      LOGGER.error(e.stack);
    }
    this.setTimeout(
      () => this.flushCounters(),
      PostEntryCounterFlusher.CYCLE_INTERVAL
    );
  }

  private async flushOneShard(
    clientPair: [string, redis.RedisClientType],
    shard: string
  ): Promise<void> {
    let [redisUrl, redisClient] = clientPair;
    let [postEntryIds] = (await redisClient
      .multi()
      .sMembers(shard)
      .del(shard)
      .exec()) as any;
    LOGGER.info(
      `Flushing client ${redisUrl} shard ${shard} with ${postEntryIds.length} ids.`
    );
    // TODO: Log/Monitor postEntryIds.length to make sure each shard doesn't contain too many entries.
    let [rows] = await this.postEntriesTable.read({
      columns: ["postEntryId", "views", "upvotes", "expirationTimestamp"],
      keys: postEntryIds,
    });
    let rowsToUpdate = new Array<any>();
    let idsToDelete = new Array<string>();
    await Promise.all(
      rows.map((row) =>
        this.calculateToUpdateOrDelete(
          row,
          redisClient,
          rowsToUpdate,
          idsToDelete
        )
      )
    );
    await Promise.all([
      this.updateRows(rowsToUpdate),
      this.deleteRows(idsToDelete),
    ]);
  }

  private async calculateToUpdateOrDelete(
    row: Row | Json,
    redisClient: redis.RedisClientType,
    rowsToUpdate: Array<any>,
    idsToDelete: Array<string>
  ): Promise<void> {
    let jsoned = row.toJSON();
    let [viewCountStr, upvoteCountStr] = (await redisClient
      .multi()
      .hGet(jsoned.postEntryId, "views")
      .hGet(jsoned.postEntryId, Reaction[Reaction.UPVOTE])
      .del(jsoned.postEntryId)
      .exec()) as any;
    let viewCount = Number.parseInt(viewCountStr ?? "0");
    let upvoteCount = Number.parseInt(upvoteCountStr ?? "0");
    let totalViews = jsoned.views + viewCount;
    let totalUpvotes = jsoned.upvotes + upvoteCount;
    let expirationTimestamp =
      Date.parse(jsoned.expirationTimestamp) -
      viewCount * 60 * 1000 +
      upvoteCount * 2 * 60 * 1000;
    if (expirationTimestamp > this.getNow()) {
      rowsToUpdate.push({
        postEntryId: jsoned.postEntryId,
        views: totalViews,
        upvotes: totalUpvotes,
        expirationTimestamp: new Date(expirationTimestamp).toISOString(),
      });
    } else {
      idsToDelete.push(jsoned.postEntryId);
    }
  }

  private async updateRows(rowsToUpdate: Array<any>): Promise<void> {
    if (rowsToUpdate.length === 0) {
      return;
    }

    await this.postsDatabase.runTransactionAsync(async (transaction) => {
      await transaction.batchUpdate(
        rowsToUpdate.map((row) => {
          return {
            sql: `UPDATE PostEntry SET views = @views, upvotes = @upvotes, expirationTimestamp = @expirationTimestamp WHERE postEntryId = @postEntryId`,
            params: {
              views: row.views,
              upvotes: row.upvotes,
              expirationTimestamp: row.expirationTimestamp,
              postEntryId: row.postEntryId,
            },
            types: {
              views: {
                type: "int64",
              },
              upvotes: {
                type: "int64",
              },
              expirationTimestamp: {
                type: "timestamp",
              },
              postEntryId: {
                type: "string",
              },
            },
          };
        })
      );
      await transaction.commit();
    });
  }

  private async deleteRows(idsToDelete: Array<string>): Promise<void> {
    if (idsToDelete.length === 0) {
      return;
    }

    await this.postsDatabase.runTransactionAsync(async (transaction) => {
      await transaction.batchUpdate([
        {
          sql: `DELETE FROM PostEntry WHERE postEntryId in UNNEST(@postEntryIds)`,
          params: {
            postEntryIds: idsToDelete,
          },
          types: {
            postEntryIds: {
              type: "array",
              child: {
                type: "string",
              },
            },
          },
        },
        {
          sql: `DELETE FROM PostEntryViewed WHERE postEntryId in UNNEST(@postEntryIds)`,
          params: {
            postEntryIds: idsToDelete,
          },
          types: {
            postEntryIds: {
              type: "array",
              child: {
                type: "string",
              },
            },
          },
        },
        {
          sql: `DELETE FROM PostEntryReacted WHERE postEntryId in UNNEST(@postEntryIds)`,
          params: {
            postEntryIds: idsToDelete,
          },
          types: {
            postEntryIds: {
              type: "array",
              child: {
                type: "string",
              },
            },
          },
        },
      ]);
      await transaction.commit();
    });
  }
}
