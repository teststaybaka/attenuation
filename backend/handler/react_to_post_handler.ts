import {
  REACT_TO_POST,
  ReactToPostRequest,
  ReactToPostResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import {
  POST_ENTRIES_COUNT_CACHE,
  PostEntriesCountCache,
} from "../common/post_entries_count_cache";
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
    private postEntriesCountCache: PostEntriesCountCache
  ) {}

  public static create(): ReactToPostHandler {
    return new ReactToPostHandler(
      POST_ENTRY_REACTED_TABLE,
      POST_ENTRIES_COUNT_CACHE
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

    this.postEntriesCountCache.incReact(request.postEntryId, request.reaction);
    return {};
  }
}
