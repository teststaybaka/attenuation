import {
  POST_ENTRY,
  PostEntry,
  PostEntryViewed,
} from "../../interface/post_entry";
import {
  READ_POSTS,
  ReadPostsRequest,
  ReadPostsResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import {
  POST_ENTRIES_COUNT_CACHE,
  PostEntriesCountCache,
} from "../common/post_entries_count_cache";
import { POSTS_DATABASE } from "../common/spanner_database";
import { POST_ENTRY_VIEWED_TABLE } from "../common/spanner_tables";
import { Database, Table } from "@google-cloud/spanner";
import { parseMessage } from "@selfage/message/parser";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class ReadPostsHandler
  implements
    AuthedServiceHandler<ReadPostsRequest, ReadPostsResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = READ_POSTS;

  public constructor(
    private postsDatabase: Database,
    private postEntryViewedTable: Table,
    private postEntriesCountCache: PostEntriesCountCache,
    private getNow: () => number
  ) {}

  public static create(): ReadPostsHandler {
    return new ReadPostsHandler(
      POSTS_DATABASE,
      POST_ENTRY_VIEWED_TABLE,
      POST_ENTRIES_COUNT_CACHE,
      () => Date.now()
    );
  }

  public async handle(
    request: ReadPostsRequest,
    session: UserSession
  ): Promise<ReadPostsResponse> {
    let [rows] = await this.postsDatabase.run(
      `SELECT pe.* FROM PostEntry as pe JOIN PostEntryViewed as pev ON pe.postEntryId = pev.postEntryId WHERE pev.postEntryId = NULL ORDER BY pe.createdTimestamp DESC LIMIT 30`
    );

    let postEntries = new Array<PostEntry>();
    let postEntriesViewed = new Array<PostEntryViewed>();
    for (let row of rows) {
      let jsoned = row.toJSON();
      jsoned.createdTimestamp = Date.parse(jsoned.createdTimestamp);
      jsoned.expirationTimestamp = Date.parse(jsoned.expirationTimestamp);

      let postEntry = parseMessage(jsoned, POST_ENTRY);
      postEntriesViewed.push({
        postEntryId: postEntry.postEntryId,
        viewerId: session.userId,
      });
      this.postEntriesCountCache.incView(postEntry.postEntryId);
      if (postEntry.expirationTimestamp >= this.getNow()) {
        postEntries.push(postEntry);
      }
    }

    this.postEntryViewedTable.insert(
      postEntriesViewed.map((viewed) => {
        return {
          ...viewed,
          viewTimestamp: "spanner.commit_timestamp()",
        };
      })
    );

    return {
      postEntries,
    };
  }
}
