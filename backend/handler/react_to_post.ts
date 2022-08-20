import { ReactToPostResponse } from "../../interface/service";
import {
  POST_ENTRY_REDIS_COUNTER,
  PostEntryRedisCounter,
} from "../common/post_entry_redis_counter";
import { CORE_DATABASE } from "../common/spanner_database";
import {
  ReactToPostHandlerInterface,
  ReactToPostHandlerRequest,
} from "./interfaces";
import { buildInsertPostEntryReactedStatement } from "./posts_sql";
import { Database } from "@google-cloud/spanner";

export class ReactToPostHandler extends ReactToPostHandlerInterface {
  public constructor(
    private coreDatabase: Database,
    private postEntryRedisCounter: PostEntryRedisCounter
  ) {
    super();
  }

  public static create(): ReactToPostHandler {
    return new ReactToPostHandler(CORE_DATABASE, POST_ENTRY_REDIS_COUNTER);
  }

  public async handle(
    request: ReactToPostHandlerRequest
  ): Promise<ReactToPostResponse> {
    await this.coreDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertPostEntryReactedStatement(
          request.userSession.userId,
          request.body.postEntryId,
          request.body.reaction
        )
      );
      await transaction.commit();
    });

    this.postEntryRedisCounter.incReact(
      request.body.postEntryId,
      request.body.reaction
    );
    return {};
  }
}
