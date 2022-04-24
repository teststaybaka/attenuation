import redis = require("redis");
import { Reaction } from "../../interface/post_entry";
import { LOGGER } from "../common/logger";
import { REDIS_CLIENTS } from "../common/redis_clients";
import { POSTS_DATABASE, POST_ENTRY_TABLE } from "../common/spanner_database";
import { Database, Table } from "@google-cloud/spanner";

export class PostEntryCounterFlusher {
  private static SHARDS_PER_REDIS_CLIENT = ["1", "2"];
  private static CYCLE_INTERVAL = 1000; // ms

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
    this.setTimeout(
      () => this.flushCounters(),
      PostEntryCounterFlusher.CYCLE_INTERVAL
    );
    return this;
  }

  private async flushCounters(): Promise<void> {
    let flushPromises = new Array<Promise<void>>();
    for (let clientPair of this.redisClients) {
      for (let shard of PostEntryCounterFlusher.SHARDS_PER_REDIS_CLIENT) {
        flushPromises.push(this.flushOneShard(clientPair[1], shard));
      }
    }
    await Promise.all(flushPromises);
    this.setTimeout(
      () => this.flushCounters(),
      PostEntryCounterFlusher.CYCLE_INTERVAL
    );
  }

  private async flushOneShard(
    redisClient: redis.RedisClientType,
    shard: string
  ): Promise<void> {
    let [postEntryIds] = (await redisClient
      .multi()
      .sMembers(shard)
      .del(shard)
      .exec()) as any;
    LOGGER.info(`postEntryIds: ${JSON.stringify(postEntryIds)}`);
    // TODO: Log/Monitor postEntryIds.length to make sure each shard doesn't contain too many entries.
    let [rows] = await this.postEntriesTable.read({
      columns: ["postEntryId", "views", "upvotes", "expirationTimestamp"],
      keys: postEntryIds,
    });
    let rowsToUpdate = new Array<object>();
    let idsToDelete = new Array<string>();
    for (let row of rows) {
      let jsoned = row.toJSON();
      let [[viewCountStr], [upvoteCountStr]] = (await redisClient
        .multi()
        .hGet(jsoned.postEntryId, "views")
        .hGet(jsoned.postEntryId, Reaction[Reaction.UPVOTE])
        .del(jsoned.postEntryId)
        .exec()) as any;
      LOGGER.info(
        `viewCountStr: ${JSON.stringify(
          viewCountStr
        )}; upvoteCountStr: ${JSON.stringify(upvoteCountStr)}`
      );
      let viewCount = Number.parseInt(viewCountStr);
      let upvoteCount = Number.parseInt(upvoteCountStr);
      let totalViews = jsoned.views + viewCount;
      let totalUpvotes = jsoned.upvotes + upvoteCount;
      let expirationTimestamp =
        Date.parse(jsoned.expirationTimestamp) -
        viewCount * 60 * 1000 +
        upvoteCount * 2 * 60 * 1000;
      if (expirationTimestamp > this.getNow()) {
        rowsToUpdate.push({
          postEntryId: jsoned.postEntryId,
          views: `${totalViews}`,
          upvotes: `${totalUpvotes}`,
          expirationTimestamp: new Date(expirationTimestamp).toISOString(),
        });
      } else {
        idsToDelete.push(jsoned.postEntryId);
      }
    }
    await Promise.all([
      this.postEntriesTable.update(rowsToUpdate),
      this.postEntriesTable.deleteRows(idsToDelete),
      this.postsDatabase.run({
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
      }),
      this.postsDatabase.run({
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
      }),
    ]);
  }
}
