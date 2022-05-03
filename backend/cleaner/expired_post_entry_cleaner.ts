import { POSTS_DATABASE } from "../common/spanner_database";
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
    let nowTimestamp = new Date(this.getNow()).toISOString();
    await this.postsDatabase.runTransactionAsync(async (transaction) => {
      await transaction.batchUpdate([
        {
          sql: `DELETE
              FROM
                PostEntryViewed
              WHERE
                postEntryId IN (
                SELECT
                  postEntryId
                FROM
                  PostEntry
                WHERE
                  expirationTimestamp < @nowTimestamp);`,
          params: {
            nowTimestamp: nowTimestamp,
          },
          types: {
            nowTimestamp: {
              type: "timestamp",
            },
          },
        },
        {
          sql: `DELETE
              FROM
                PostEntryReacted
              WHERE
                postEntryId IN (
                SELECT
                  postEntryId
                FROM
                  PostEntry
                WHERE
                  expirationTimestamp < @nowTimestamp);`,
          params: {
            nowTimestamp: nowTimestamp,
          },
          types: {
            nowTimestamp: {
              type: "timestamp",
            },
          },
        },
      ]);
      await transaction.commit();
    });
    await this.postsDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate({
        sql: `DELETE
              FROM
              PostEntry
              WHERE
                  expirationTimestamp < @nowTimestamp;`,
        params: {
          nowTimestamp: nowTimestamp,
        },
        types: {
          nowTimestamp: {
            type: "timestamp",
          },
        },
      });
      await transaction.commit();
    });
    this.setTimeout(
      () => this.cleanExpiredEntries(),
      ExpiredPostEntryCleaner.CYCLE_INTERVAL
    );
  }
}
