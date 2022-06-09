import { Statement } from '@google-cloud/spanner/build/src/transaction';

export function buildInsertNewUserStatement(
  userId: string,
  username: string,
  naturalName: string,
  passwordHashV1: string,
  pictureUrl: string,
): Statement {
  return {
    sql: "INSERT User (userId, username, naturalName, passwordHashV1, pictureUrl, createdTimestamp) VALUES (@userId, @username, @naturalName, @passwordHashV1, @pictureUrl, PENDING_COMMIT_TIMESTAMP())",
    params: {
      userId,
      username,
      naturalName,
      passwordHashV1,
      pictureUrl,
    },
    types: {
      userId: {
        type: "string"
      },
      username: {
        type: "string"
      },
      naturalName: {
        type: "string"
      },
      passwordHashV1: {
        type: "string"
      },
      pictureUrl: {
        type: "string"
      },
    }
  }
}

export function buildLookupUserStatement(
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

export interface LookupUserRow {
  userId: string;
  passwordHashV1: string;
}

export function parseLookupUserRow(row: any): LookupUserRow {
  // No need to wrap number until we want to support int64 as bigint.
  let obj = row.toJSON();
  return obj;
}

export function buildGetUserInfoStatement(
  userId: string,
): Statement {
  return {
    sql: "SELECT username, naturalName, pictureUrl FROM User where userId = @userId",
    params: {
      userId,
    },
    types: {
      userId: {
        type: "string"
      },
    }
  }
}

export interface GetUserInfoRow {
  username: string;
  naturalName: string;
  pictureUrl: string;
}

export function parseGetUserInfoRow(row: any): GetUserInfoRow {
  // No need to wrap number until we want to support int64 as bigint.
  let obj = row.toJSON();
  return obj;
}
