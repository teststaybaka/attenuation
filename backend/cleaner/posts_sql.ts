import { Statement } from '@google-cloud/spanner/build/src/transaction';

export function buildDeleteExpiredPostEntryViewsStatement(
  nowTimestamp: number,
): Statement {
  return {
    sql: "DELETE FROM PostEntryViewed WHERE postEntryId IN (SELECT postEntryId FROM PostEntry WHERE expirationTimestamp < @nowTimestamp)",
    params: {
      nowTimestamp: new Date(nowTimestamp).toISOString(),
    },
    types: {
      nowTimestamp: {
        type: "timestamp"
      },
    }
  }
}

export function buildDeleteExpiredPostEntryReactionsStatement(
  nowTimestamp: number,
): Statement {
  return {
    sql: "DELETE FROM PostEntryReacted WHERE postEntryId IN (SELECT postEntryId FROM PostEntry WHERE expirationTimestamp < @nowTimestamp)",
    params: {
      nowTimestamp: new Date(nowTimestamp).toISOString(),
    },
    types: {
      nowTimestamp: {
        type: "timestamp"
      },
    }
  }
}

export function buildDeleteExpiredPostEntriesStatement(
  nowTimestamp: number,
): Statement {
  return {
    sql: "DELETE FROM PostEntry WHERE expirationTimestamp < @nowTimestamp",
    params: {
      nowTimestamp: new Date(nowTimestamp).toISOString(),
    },
    types: {
      nowTimestamp: {
        type: "timestamp"
      },
    }
  }
}
