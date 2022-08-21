import { Statement } from '@google-cloud/spanner/build/src/transaction';

export function buildInsertNewUserStatement(
  userId: string,
  username: string,
  naturalName: string,
  passwordHashV1: string,
  avatarLargePath: string,
  avatarSmallPath: string,
): Statement {
  return {
    sql: "INSERT User (userId, username, naturalName, passwordHashV1, avatarLargePath, avatarSmallPath, createdTimestamp) VALUES (@userId, @username, @naturalName, @passwordHashV1, @avatarLargePath, @avatarSmallPath, PENDING_COMMIT_TIMESTAMP())",
    params: {
      userId,
      username,
      naturalName,
      passwordHashV1,
      avatarLargePath,
      avatarSmallPath,
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
      avatarLargePath: {
        type: "string"
      },
      avatarSmallPath: {
        type: "string"
      },
    }
  }
}

export function buildLookupUserByUsernameStatement(
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

export interface LookupUserByUsernameRow {
  userId: string;
  passwordHashV1: string;
}

export function parseLookupUserByUsernameRow(row: any): LookupUserByUsernameRow {
  // No need to wrap number until we want to support int64 as bigint.
  let obj = row.toJSON();
  return obj;
}

export function buildGetUserInfoStatement(
  userId: string,
): Statement {
  return {
    sql: "SELECT username, naturalName, avatarLargePath FROM User where userId = @userId",
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
  avatarLargePath: string;
}

export function parseGetUserInfoRow(row: any): GetUserInfoRow {
  // No need to wrap number until we want to support int64 as bigint.
  let obj = row.toJSON();
  return obj;
}

export function buildUpdateUserAvatarStatement(
  avatarLargePath: string,
  avatarSmallPath: string,
  userId: string,
): Statement {
  return {
    sql: "UPDATE User SET avatarLargePath = @avatarLargePath, avatarSmallPath = @avatarSmallPath WHERE userId = @userId",
    params: {
      avatarLargePath,
      avatarSmallPath,
      userId,
    },
    types: {
      avatarLargePath: {
        type: "string"
      },
      avatarSmallPath: {
        type: "string"
      },
      userId: {
        type: "string"
      },
    }
  }
}
