import { ViewPostResponse } from "../../interface/service";
import {
  POST_ENTRY_REDIS_COUNTER,
  PostEntryRedisCounter,
} from "../common/post_entry_redis_counter";
import { CORE_DATABASE } from "../common/spanner_database";
import { ViewPostHandlerInterface, ViewPostHandlerRequest } from "./interfaces";
import { buildInsertPostEntryViewedStatement } from "./posts_sql";
import { Database } from "@google-cloud/spanner";

export class ViewPostHandler extends ViewPostHandlerInterface {
  public constructor(
    private coreDatabase: Database,
    private postEntryRedisCounter: PostEntryRedisCounter
  ) {
    super();
  }

  public static create(): ViewPostHandler {
    return new ViewPostHandler(CORE_DATABASE, POST_ENTRY_REDIS_COUNTER);
  }

  public async handle(
    request: ViewPostHandlerRequest
  ): Promise<ViewPostResponse> {
    await this.coreDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertPostEntryViewedStatement(
          request.userSession.userId,
          request.body.postEntryId
        )
      );
      await transaction.commit();
    });
    this.postEntryRedisCounter.incView(request.body.postEntryId);
    return {};
  }
}
