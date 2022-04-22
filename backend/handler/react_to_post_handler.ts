import {
  REACT_TO_POST,
  ReactToPostRequest,
  ReactToPostResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import {
  POST_ENTRIES_REDIS_COUNTER,
  PostEntriesRedisCounter,
} from "../common/post_entry_redis_counter";
import { POST_ENTRY_REACTED_TABLE } from "../common/spanner_database";
import { Table } from "@google-cloud/spanner";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class ReactToPostHandler
  implements
    AuthedServiceHandler<ReactToPostRequest, ReactToPostResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = REACT_TO_POST;

  public constructor(
    private postEntryReactedTable: Table,
    private postEntriesRedisCounter: PostEntriesRedisCounter
  ) {}

  public static create(): ReactToPostHandler {
    return new ReactToPostHandler(
      POST_ENTRY_REACTED_TABLE,
      POST_ENTRIES_REDIS_COUNTER
    );
  }

  public async handle(
    request: ReactToPostRequest,
    session: UserSession
  ): Promise<ReactToPostResponse> {
    await this.postEntryReactedTable.insert([
      {
        postEntryId: request.postEntryId,
        reactorId: session.userId,
        reaction: `${request.reaction}`,
        reactedTimestamp: "spanner.commit_timestamp()",
      },
    ]);

    this.postEntriesRedisCounter.incReact(
      request.postEntryId,
      request.reaction
    );
    return {};
  }
}
