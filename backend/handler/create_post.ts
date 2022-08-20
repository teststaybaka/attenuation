import { CreatePostResponse } from "../../interface/service";
import { CORE_DATABASE } from "../common/spanner_database";
import {
  CreatePostHandlerInterface,
  CreatePostHandlerRequest,
} from "./interfaces";
import { buildInsertNewPostEntryStatement } from "./posts_sql";
import { Database } from "@google-cloud/spanner";
import { v4 as uuidv4 } from "uuid";

export class CreatePostHandler extends CreatePostHandlerInterface {
  public constructor(
    private coreDatabase: Database,
    private getNow: () => number
  ) {
    super();
  }

  public static create(): CreatePostHandler {
    return new CreatePostHandler(CORE_DATABASE, () => Date.now());
  }

  public async handle(
    request: CreatePostHandlerRequest
  ): Promise<CreatePostResponse> {
    let createdTimestamp = this.getNow();
    let expirationTimestamp = createdTimestamp + 24 * 60 * 60 * 1000;
    let postEntryId = uuidv4();
    await this.coreDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertNewPostEntryStatement(
          postEntryId,
          request.userSession.userId,
          request.body.content,
          0,
          0,
          createdTimestamp,
          expirationTimestamp
        )
      );
      await transaction.commit();
    });
    return {
      postEntryCard: {
        postEntryId,
        userId: request.userSession.userId,
        content: request.body.content,
        createdTimestamp,
      },
    };
  }
}
