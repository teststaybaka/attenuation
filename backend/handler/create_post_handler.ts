import { PostEntry } from "../../interface/post_entry";
import {
  CREATE_POST,
  CreatePostRequest,
  CreatePostResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import { POSTS_DATABASE } from "../common/spanner_database";
import { buildInsertNewPostEntryStatement } from "./posts_sql";
import { Database } from "@google-cloud/spanner";
import { AuthedServiceHandler } from "@selfage/service_handler";
import { v4 as uuidv4 } from "uuid";

export class CreatePostHandler
  implements
    AuthedServiceHandler<CreatePostRequest, CreatePostResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = CREATE_POST;

  public constructor(
    private postsDatabase: Database,
    private getNow: () => number
  ) {}

  public static create(): CreatePostHandler {
    return new CreatePostHandler(POSTS_DATABASE, () => Date.now());
  }

  public async handle(
    request: CreatePostRequest,
    session: UserSession
  ): Promise<CreatePostResponse> {
    let createdTimestamp = this.getNow();
    let expirationTimestamp = createdTimestamp + 24 * 60 * 60 * 1000;
    let postEntry: PostEntry = {
      postEntryId: uuidv4(),
      userId: session.userId,
      content: request.content,
      views: 0,
      upvotes: 0,
      createdTimestamp,
      expirationTimestamp,
    };
    await this.postsDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertNewPostEntryStatement(
          postEntry.postEntryId,
          postEntry.userId,
          postEntry.content,
          postEntry.upvotes,
          postEntry.views,
          postEntry.createdTimestamp,
          postEntry.expirationTimestamp
        )
      );
      await transaction.commit();
    });
    return {
      postEntry,
    };
  }
}
