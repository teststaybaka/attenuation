import redis = require("redis");
import { PostEntryReaction } from "../../interface/post_entry_reaction";
import { LOGGER } from "../common/logger";
import { REDIS_CLIENTS } from "../common/redis_clients";
import { POSTS_DATABASE } from "../common/spanner_database";
import {
  FetchPostEntriesRow,
  buildFetchPostEntriesStatement,
  parseFetchPostEntriesRow,
} from "./posts_sql";
import { Database } from "@google-cloud/spanner";

export class PostEntryCounterFlusher {
  private static SHARDS_PER_REDIS_CLIENT = ["1", "2"];
  private static CYCLE_INTERVAL = 60000; // ms

  public constructor(
    private redisClients: Array<[string, redis.RedisClientType]>,
    private postsDatabase: Database,
    private setTimeout: (handler: TimerHandler, timeout: number) => void,
    private getNow: () => number
  ) {}

  public static create(): void {
    new PostEntryCounterFlusher(REDIS_CLIENTS, POSTS_DATABASE, setTimeout, () =>
      Date.now()
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
    let [rows] = await this.postsDatabase.run(
      buildFetchPostEntriesStatement(postEntryIds)
    );
    let rowsToUpdate = new Array<FetchPostEntriesRow>();
    let idsToDelete = new Array<string>();
    await Promise.all(
      rows.map((row) =>
        this.calculateToUpdateOrDelete(
          parseFetchPostEntriesRow(row),
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
    row: FetchPostEntriesRow,
    redisClient: redis.RedisClientType,
    rowsToUpdate: Array<FetchPostEntriesRow>,
    idsToDelete: Array<string>
  ): Promise<void> {
    let [viewCountStr, upvoteCountStr] = (await redisClient
      .multi()
      .hGet(row.postEntryId, "views")
      .hGet(row.postEntryId, PostEntryReaction[PostEntryReaction.UPVOTE])
      .del(row.postEntryId)
      .exec()) as any;
    let viewCount = Number.parseInt(viewCountStr ?? "0");
    let upvoteCount = Number.parseInt(upvoteCountStr ?? "0");
    let totalViews = row.views + viewCount;
    let totalUpvotes = row.upvotes + upvoteCount;
    let expirationTimestamp =
      row.expirationTimestamp -
      viewCount * 60 * 1000 +
      upvoteCount * 2 * 60 * 1000;
    if (expirationTimestamp > this.getNow()) {
      rowsToUpdate.push({
        postEntryId: row.postEntryId,
        views: totalViews,
        upvotes: totalUpvotes,
        expirationTimestamp,
      });
    } else {
      idsToDelete.push(row.postEntryId);
    }
  }

  private async updateRows(
    rowsToUpdate: Array<FetchPostEntriesRow>
  ): Promise<void> {
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
