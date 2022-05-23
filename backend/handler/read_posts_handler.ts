import { PostEntryCard } from "../../interface/post_entry_card";
import {
  READ_POSTS,
  ReadPostsRequest,
  ReadPostsResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import { POSTS_DATABASE } from "../common/spanner_database";
import {
  buildQueryNewPostsStatement,
  parseQueryNewPostsRow,
} from "./posts_sql";
import { Database } from "@google-cloud/spanner";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class ReadPostsHandler
  implements
    AuthedServiceHandler<ReadPostsRequest, ReadPostsResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = READ_POSTS;

  public constructor(
    private postsDatabase: Database,
    private getNow: () => number
  ) {}

  public static create(): ReadPostsHandler {
    return new ReadPostsHandler(POSTS_DATABASE, () => Date.now());
  }

  public async handle(
    request: ReadPostsRequest,
    session: UserSession
  ): Promise<ReadPostsResponse> {
    let [rows] = await this.postsDatabase.run(
      buildQueryNewPostsStatement(session.userId)
    );
    let postEntryCards = new Array<PostEntryCard>();
    for (let row of rows) {
      let postEntryRow = parseQueryNewPostsRow(row);
      if (postEntryRow.expirationTimestamp >= this.getNow()) {
        postEntryCards.push(postEntryRow);
      }
    }
    return {
      postEntryCards,
    };
  }
}
