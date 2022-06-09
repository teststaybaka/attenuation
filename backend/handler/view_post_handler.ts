import {
  VIEW_POST,
  ViewPostRequest,
  ViewPostResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import {
  POST_ENTRY_REDIS_COUNTER,
  PostEntryRedisCounter,
} from "../common/post_entry_redis_counter";
import { CORE_DATABASE } from "../common/spanner_database";
import { buildInsertPostEntryViewedStatement } from "./posts_sql";
import { Database } from "@google-cloud/spanner";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class ViewPostHandler
  implements
    AuthedServiceHandler<ViewPostRequest, ViewPostResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = VIEW_POST;

  public constructor(
    private coreDatabase: Database,
    private postEntryRedisCounter: PostEntryRedisCounter
  ) {}

  public static create(): ViewPostHandler {
    return new ViewPostHandler(CORE_DATABASE, POST_ENTRY_REDIS_COUNTER);
  }

  public async handle(
    request: ViewPostRequest,
    session: UserSession
  ): Promise<ViewPostResponse> {
    await this.coreDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertPostEntryViewedStatement(session.userId, request.postEntryId)
      );
      await transaction.commit();
    });
    this.postEntryRedisCounter.incView(request.postEntryId);
    return {};
  }
}
