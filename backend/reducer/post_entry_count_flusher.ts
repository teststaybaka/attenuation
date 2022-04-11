import {
  POST_ENTRIES_COUNT_CACHE,
  PostEntriesCountCache,
} from "../common/post_entries_count_cache";
import { POSTS_DATABASE } from "../common/spanner_database";
import { POST_ENTRY_TABLE } from "../common/spanner_tables";
import { Database, Table } from "@google-cloud/spanner";

export class PostEntryCountFlusher {
  private static CYCLE_INTERVAL = 1000; // ms

  public constructor(
    private postEntriesCountCache: PostEntriesCountCache,
    private postsDatabase: Database,
    private postEntriesTable: Table,
    private setTimeout: (handler: TimerHandler, timeout: number) => void,
    private getNow: () => number
  ) {}

  public static create(): PostEntryCountFlusher {
    return new PostEntryCountFlusher(
      POST_ENTRIES_COUNT_CACHE,
      POSTS_DATABASE,
      POST_ENTRY_TABLE,
      setTimeout,
      () => Date.now()
    ).init();
  }

  public init(): this {
    this.setTimeout(
      () => this.flushCount(),
      PostEntryCountFlusher.CYCLE_INTERVAL
    );
    return this;
  }

  private async flushCount(): Promise<void> {
    let counters = this.postEntriesCountCache.counters;
    this.postEntriesCountCache.counters = new Map();
    let keys = new Array<string>();
    for (let postEntrId of counters.keys()) {
      keys.push(postEntrId);
    }
    let [rows] = await this.postEntriesTable.read({
      columns: ["postEntryId", "views", "upvotes", "expirationTimestamp"],
      keys,
    });
    let rowsToUpdate = new Array<object>();
    let idsToDelete = new Array<string>();
    for (let row of rows) {
      let jsoned = row.toJSON();
      let counter = counters.get(jsoned.postEntryId);
      let views = jsoned.views + counter.views;
      let upvotes = jsoned.upvotes + counter.upvotes;
      let expirationTimestamp =
        Date.parse(jsoned.expirationTimestamp) -
        counter.views * 60 * 1000 +
        counter.upvotes * 2 * 60 * 1000;
      if (expirationTimestamp > this.getNow()) {
        rowsToUpdate.push({
          postEntryId: jsoned.postEntryId,
          views: `${views}`,
          upvotes: `${upvotes}`,
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

    this.setTimeout(
      () => this.flushCount(),
      PostEntryCountFlusher.CYCLE_INTERVAL
    );
  }
}
