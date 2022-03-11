import {
  UPVOTE_POST,
  UpvotePostRequest,
  UpvotePostResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import { POST_ENTRY_MODEL } from "../data_model/post_entry_model";
import { DatastoreClient } from "@selfage/datastore_client";
import { newNotFoundError } from "@selfage/http_error";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class UpvotePostHandler
  implements
    AuthedServiceHandler<UpvotePostRequest, UpvotePostResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = UPVOTE_POST;

  public constructor(
    private datastoreClient: DatastoreClient,
    private getNow: () => number
  ) {}

  public static create(): UpvotePostHandler {
    return new UpvotePostHandler(DatastoreClient.create(), () => Date.now());
  }

  public async handle(
    logContext: string,
    request: UpvotePostRequest,
    session: UserSession
  ): Promise<UpvotePostResponse> {
    let postEntries = await this.datastoreClient.get(
      [request.postEntryId],
      POST_ENTRY_MODEL
    );
    if (postEntries.length < 1) {
      throw newNotFoundError(`Post entry ${request.postEntryId} is not found.`);
    }
    let postEntry = postEntries[0];
    if (postEntry.expiration < this.getNow() / 1000) {
      console.log(
        `${logContext}Post entry ${request.postEntryId} has expired.`
      );
    }
    postEntry.upvotes += 1;
    postEntry.expiration += 60;
    this.datastoreClient.save([postEntry], POST_ENTRY_MODEL, "update");
    return {};
  }
}
