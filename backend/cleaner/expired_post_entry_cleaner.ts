import { POSTS_DATABASE } from "../common/spanner_database";
import {
  buildDeleteExpiredPostEntriesStatement,
  buildDeleteExpiredPostEntryReactionsStatement,
  buildDeleteExpiredPostEntryViewsStatement,
} from "./posts_sql";
import { Database } from "@google-cloud/spanner";

export class ExpiredPostEntryCleaner {
  private static CYCLE_INTERVAL = 600000; // ms

  public constructor(
    private postsDatabase: Database,
    private setTimeout: (handler: TimerHandler, timeout: number) => void,
    private getNow: () => number
  ) {}

  public static create(): void {
    new ExpiredPostEntryCleaner(POSTS_DATABASE, setTimeout, () =>
      Date.now()
    ).init();
  }

  public init(): this {
    this.setTimeout(() => this.cleanExpiredEntries(), 0);
    return this;
  }

  private async cleanExpiredEntries(): Promise<void> {
    let nowTimestamp = this.getNow();
    await this.postsDatabase.runTransactionAsync(async (transaction) => {
      await transaction.batchUpdate([
        buildDeleteExpiredPostEntryViewsStatement(nowTimestamp),
        buildDeleteExpiredPostEntryReactionsStatement(nowTimestamp),
      ]);
      await transaction.runUpdate(
        buildDeleteExpiredPostEntriesStatement(nowTimestamp)
      );
      await transaction.commit();
    });
    this.setTimeout(
      () => this.cleanExpiredEntries(),
      ExpiredPostEntryCleaner.CYCLE_INTERVAL
    );
  }
}
