import {
  CREATE_POST,
  CreatePostRequest,
  CreatePostResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import { POST_ENTRY_MODEL } from "../data_model/post_entry_model";
import { DatastoreClient } from "@selfage/datastore_client";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class CreatePostHandler
  implements
    AuthedServiceHandler<CreatePostRequest, CreatePostResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = CREATE_POST;

  public constructor(
    private datastoreClient: DatastoreClient,
    private getNow: () => number
  ) {}

  public static create(): CreatePostHandler {
    return new CreatePostHandler(DatastoreClient.create(), () => Date.now());
  }

  public async handle(
    logContext: string,
    request: CreatePostRequest,
    session: UserSession
  ): Promise<CreatePostResponse> {
    let postEntry = request.postEntry;
    postEntry.userId = session.userId;
    postEntry.created = this.getNow() / 1000;
    await this.datastoreClient.allocateKeys([postEntry], POST_ENTRY_MODEL);
    await this.datastoreClient.save([postEntry], POST_ENTRY_MODEL, "insert");

    return {
      postEntry,
    };
  }
}
