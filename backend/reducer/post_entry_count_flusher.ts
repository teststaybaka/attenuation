import {
  POST_ENTRIES_COUNT_CACHE,
  PostEntriesCountCache,
} from "../common/post_entries_count_cache";
import { POST_ENTRY_TABLE } from "../common/spanner_tables";
import { Table } from "@google-cloud/spanner";

export class PostEntryCountFlusher {
  private static CYCLE_INTERVAL = 1000; // ms

  public constructor(
    private postEntriesCountCache: PostEntriesCountCache,
    private postEntriesTable: Table,
    private setTimeout: (handler: TimerHandler, timeout: number) => void
  ) {}

  public static create(): PostEntryCountFlusher {
    return new PostEntryCountFlusher(
      POST_ENTRIES_COUNT_CACHE,
      POST_ENTRY_TABLE,
      setTimeout
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
      columns: ["postEntryId", "views", "upvotes"],
      keys,
    });
    await this.postEntriesTable.update([
      rows.map((row) => {
        let jsoned = row.toJSON();
        let counter = counters.get(jsoned.postEntryId);
        return {
          postEntryId: jsoned.postEntryId,
          views: `${jsoned.views + counter.views}`,
          upvotes: `${jsoned.upvotes + counter.upvotes}`,
        };
      }),
    ]);

    this.setTimeout(
      () => this.flushCount(),
      PostEntryCountFlusher.CYCLE_INTERVAL
    );
  }
}
