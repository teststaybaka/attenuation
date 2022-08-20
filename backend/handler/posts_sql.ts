import { Statement } from '@google-cloud/spanner/build/src/transaction';

export function buildInsertNewPostEntryStatement(
  postEntryId: string,
  userId: string,
  content: string,
  upvotes: number,
  views: number,
  createdTimestamp: number,
  expirationTimestamp: number,
): Statement {
  return {
    sql: "INSERT PostEntry (postEntryId, userId, content, upvotes, views, createdTimestamp, expirationTimestamp) VALUES (@postEntryId, @userId, @content, @upvotes, @views, @createdTimestamp, @expirationTimestamp)",
    params: {
      postEntryId,
      userId,
      content,
      upvotes,
      views,
      createdTimestamp: new Date(createdTimestamp).toISOString(),
      expirationTimestamp: new Date(expirationTimestamp).toISOString(),
    },
    types: {
      postEntryId: {
        type: "string"
      },
      userId: {
        type: "string"
      },
      content: {
        type: "string"
      },
      upvotes: {
        type: "int64"
      },
      views: {
        type: "int64"
      },
      createdTimestamp: {
        type: "timestamp"
      },
      expirationTimestamp: {
        type: "timestamp"
      },
    }
  }
}

export function buildQueryNewPostsStatement(
  viewerId: string,
): Statement {
  return {
    sql: "SELECT pe.postEntryId, pe.repliedEntryId, pe.userId, u.username, u.naturalName, u.avatarSmallPath, pe.content, pe.createdTimestamp, pe.expirationTimestamp, FROM PostEntry AS pe LEFT JOIN (SELECT postEntryId FROM PostEntryViewed WHERE viewerId = @viewerId) AS pev ON pe.postEntryId = pev.postEntryId JOIN User AS u ON pe.userId = u.userId WHERE pev.postEntryId IS NULL ORDER BY pe.createdTimestamp DESC LIMIT 30",
    params: {
      viewerId,
    },
    types: {
      viewerId: {
        type: "string"
      },
    }
  }
}

export interface QueryNewPostsRow {
  postEntryId: string;
  repliedEntryId: string;
  userId: string;
  username: string;
  naturalName: string;
  avatarSmallPath: string;
  content: string;
  createdTimestamp: number;
  expirationTimestamp: number;
}

export function parseQueryNewPostsRow(row: any): QueryNewPostsRow {
  // No need to wrap number until we want to support int64 as bigint.
  let obj = row.toJSON();
  obj.createdTimestamp = Date.parse(obj.createdTimestamp);
  obj.expirationTimestamp = Date.parse(obj.expirationTimestamp);
  return obj;
}

export function buildInsertPostEntryViewedStatement(
  viewerId: string,
  postEntryId: string,
): Statement {
  return {
    sql: "INSERT PostEntryViewed (viewerId, postEntryId, viewTimestamp) VALUES (@viewerId, @postEntryId, PENDING_COMMIT_TIMESTAMP())",
    params: {
      viewerId,
      postEntryId,
    },
    types: {
      viewerId: {
        type: "string"
      },
      postEntryId: {
        type: "string"
      },
    }
  }
}

export function buildInsertPostEntryReactedStatement(
  reactorId: string,
  postEntryId: string,
  reaction: number,
): Statement {
  return {
    sql: "INSERT PostEntryReacted (reactorId, postEntryId, reaction, reactedTimestamp) VALUES (@reactorId, @postEntryId, @reaction, PENDING_COMMIT_TIMESTAMP())",
    params: {
      reactorId,
      postEntryId,
      reaction,
    },
    types: {
      reactorId: {
        type: "string"
      },
      postEntryId: {
        type: "string"
      },
      reaction: {
        type: "int64"
      },
    }
  }
}
