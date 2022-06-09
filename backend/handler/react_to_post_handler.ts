import {
  REACT_TO_POST,
  ReactToPostRequest,
  ReactToPostResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import {
  POST_ENTRY_REDIS_COUNTER,
  PostEntryRedisCounter,
} from "../common/post_entry_redis_counter";
import { CORE_DATABASE } from "../common/spanner_database";
import { buildInsertPostEntryReactedStatement } from "./posts_sql";
import { Database } from "@google-cloud/spanner";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class ReactToPostHandler
  implements
    AuthedServiceHandler<ReactToPostRequest, ReactToPostResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = REACT_TO_POST;

  public constructor(
    private coreDatabase: Database,
    private postEntryRedisCounter: PostEntryRedisCounter
  ) {}

  public static create(): ReactToPostHandler {
    return new ReactToPostHandler(CORE_DATABASE, POST_ENTRY_REDIS_COUNTER);
  }

  public async handle(
    request: ReactToPostRequest,
    session: UserSession
  ): Promise<ReactToPostResponse> {
    await this.coreDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertPostEntryReactedStatement(
          session.userId,
          request.postEntryId,
          request.reaction
        )
      );
      await transaction.commit();
    });

    this.postEntryRedisCounter.incReact(request.postEntryId, request.reaction);
    return {};
  }
}
