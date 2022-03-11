import { PostEntry } from "../../interface/post_entry";
import {
  READ_POSTS,
  ReadPostsRequest,
  ReadPostsResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import {
  DescendQueryBuilder,
  POST_ENTRY_MODEL,
} from "../data_model/post_entry_model";
import { DatastoreClient } from "@selfage/datastore_client";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class ReadPostsHandler
  implements
    AuthedServiceHandler<ReadPostsRequest, ReadPostsResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = READ_POSTS;

  public constructor(
    private datastoreClient: DatastoreClient,
    private getNow: () => number
  ) {}

  public static create(): ReadPostsHandler {
    return new ReadPostsHandler(DatastoreClient.create(), () => Date.now());
  }

  public async handle(
    logContext: string,
    request: ReadPostsRequest,
    session: UserSession
  ): Promise<ReadPostsResponse> {
    let response = await this.datastoreClient.query(
      new DescendQueryBuilder().limit(20).build()
    );
    let expiredEntryKeys = new Array<string>();
    let writeBackEntries = new Array<PostEntry>();
    for (let postEntry of response.values) {
      postEntry.expiration -= 60;
      if (postEntry.expiration < this.getNow() / 1000) {
        expiredEntryKeys.push(postEntry.id);
      } else {
        writeBackEntries.push(postEntry);
      }
    }
    this.datastoreClient.save(writeBackEntries, POST_ENTRY_MODEL, "update");
    this.datastoreClient.delete(expiredEntryKeys, POST_ENTRY_MODEL);
    return {
      postEntries: response.values,
    };
  }
}
