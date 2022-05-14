import { Statement } from '@google-cloud/spanner/build/src/transaction';

export function buildInsertNewUserStatement(
  userId: string,
  username: string,
  passwordHashV1: string,
): Statement {
  return {
    sql: "INSERT User (userId, username, passwordHashV1, createdTimestamp) VALUES (@userId, @username, @passwordHashV1, PENDING_COMMIT_TIMESTAMP())",
    params: {
      userId,
      username,
      passwordHashV1,
    },
    types: {
      userId: {
        type: "string"
      },
      username: {
        type: "string"
      },
      passwordHashV1: {
        type: "string"
      },
    }
  }
}

export function buildGetUserStatement(
  username: string,
): Statement {
  return {
    sql: "SELECT userId, passwordHashV1 FROM User WHERE username = @username",
    params: {
      username,
    },
    types: {
      username: {
        type: "string"
      },
    }
  }
}

export interface GetUserRow {
  userId: string;
  passwordHashV1: string;
}

export function parseGetUserRow(row: any): GetUserRow {
  // No need to wrap number until we want to support int64 as bigint.
  let obj = row.toJSON();
  return obj;
}
