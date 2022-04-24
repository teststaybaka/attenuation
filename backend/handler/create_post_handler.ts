import { PostEntry } from "../../interface/post_entry";
import {
  CREATE_POST,
  CreatePostRequest,
  CreatePostResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import { POST_ENTRY_TABLE } from "../common/spanner_database";
import { Table } from "@google-cloud/spanner";
import { AuthedServiceHandler } from "@selfage/service_handler";
import { v4 as uuidv4 } from "uuid";

export class CreatePostHandler
  implements
    AuthedServiceHandler<CreatePostRequest, CreatePostResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = CREATE_POST;

  public constructor(
    private postEntryTable: Table,
    private getNow: () => number
  ) {}

  public static create(): CreatePostHandler {
    return new CreatePostHandler(POST_ENTRY_TABLE, () => Date.now());
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
    await this.postEntryTable.insert([
      {
        postEntryId: postEntry.postEntryId,
        userId: postEntry.userId,
        content: postEntry.content,
        views: "0",
        upvotes: "0",
        createdTimestamp: new Date(createdTimestamp).toISOString(),
        expirationTimestamp: new Date(expirationTimestamp).toISOString(),
      },
    ]);
    return {
      postEntry,
    };
  }
}
