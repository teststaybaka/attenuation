import { Statement } from '@google-cloud/spanner/build/src/transaction';

export function buildFetchPostEntriesStatement(
  postEntryIds: Array<string>,
): Statement {
  return {
    sql: "SELECT postEntryId, views, upvotes, expirationTimestamp FROM PostEntry WHERE postEntryId in UNNEST(@postEntryIds)",
    params: {
      postEntryIds,
    },
    types: {
      postEntryIds: {
        type: "array",
        child: {
          type: "string"
        }
      }
    }
  }
}

export interface FetchPostEntriesRow {
  postEntryId: string;
  views: number;
  upvotes: number;
  expirationTimestamp: number;
}

export function parseFetchPostEntriesRow(row: any): FetchPostEntriesRow {
  // No need to wrap number until we want to support int64 as bigint.
  let obj = row.toJSON();
  obj.expirationTimestamp = Date.parse(obj.expirationTimestamp);
  return obj;
}

export function buildUpdateViewsAndReactionsStatement(
  views: number,
  upvotes: number,
  expirationTimestamp: number,
  postEntryId: string,
): Statement {
  return {
    sql: "UPDATE PostEntry SET views = @views, upvotes = @upvotes, expirationTimestamp = @expirationTimestamp WHERE postEntryId = @postEntryId",
    params: {
      views,
      upvotes,
      expirationTimestamp: new Date(expirationTimestamp).toISOString(),
      postEntryId,
    },
    types: {
      views: {
        type: "int64"
      },
      upvotes: {
        type: "int64"
      },
      expirationTimestamp: {
        type: "timestamp"
      },
      postEntryId: {
        type: "string"
      },
    }
  }
}

export function buildDeletePostEntriesStatement(
  postEntryIds: Array<string>,
): Statement {
  return {
    sql: "DELETE FROM PostEntry WHERE postEntryId in UNNEST(@postEntryIds)",
    params: {
      postEntryIds,
    },
    types: {
      postEntryIds: {
        type: "array",
        child: {
          type: "string"
        }
      }
    }
  }
}

export function buildDeletePostEntryViewsStatement(
  postEntryIds: Array<string>,
): Statement {
  return {
    sql: "DELETE FROM PostEntryViewed WHERE postEntryId in UNNEST(@postEntryIds)",
    params: {
      postEntryIds,
    },
    types: {
      postEntryIds: {
        type: "array",
        child: {
          type: "string"
        }
      }
    }
  }
}

export function buildDeletePostEntryReactionsStatement(
  postEntryIds: Array<string>,
): Statement {
  return {
    sql: "DELETE FROM PostEntryReacted WHERE postEntryId in UNNEST(@postEntryIds)",
    params: {
      postEntryIds,
    },
    types: {
      postEntryIds: {
        type: "array",
        child: {
          type: "string"
        }
      }
    }
  }
}
