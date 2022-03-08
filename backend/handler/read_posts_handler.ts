import {
  READ_POSTS,
  ReadPostsRequest,
  ReadPostsResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import { DescendQueryBuilder } from "../data_model/post_entry_model";
import { DatastoreClient } from "@selfage/datastore_client";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class ReadPostsHandler
  implements
    AuthedServiceHandler<ReadPostsRequest, ReadPostsResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = READ_POSTS;

  public constructor(private datastoreClient: DatastoreClient) {}

  public static create(): ReadPostsHandler {
    return new ReadPostsHandler(DatastoreClient.create());
  }

  public async handle(
    logContext: string,
    request: ReadPostsRequest,
    session: UserSession
  ): Promise<ReadPostsResponse> {
    let response = await this.datastoreClient.query(
      new DescendQueryBuilder().equalToUserId(session.userId).limit(20).build()
    );
    return {
      postEntries: response.values,
    };
  }
}
