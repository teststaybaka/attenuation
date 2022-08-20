import { PostEntryCard } from "../../interface/post_entry_card";
import { ReadPostsResponse } from "../../interface/service";
import { CORE_DATABASE } from "../common/spanner_database";
import {
  ReadPostsHandlerInterface,
  ReadPostsHandlerRequest,
} from "./interfaces";
import {
  buildQueryNewPostsStatement,
  parseQueryNewPostsRow,
} from "./posts_sql";
import { Database } from "@google-cloud/spanner";

export class ReadPostsHandler extends ReadPostsHandlerInterface {
  public constructor(
    private coreDatabase: Database,
    private getNow: () => number
  ) {
    super();
  }

  public static create(): ReadPostsHandler {
    return new ReadPostsHandler(CORE_DATABASE, () => Date.now());
  }

  public async handle(
    request: ReadPostsHandlerRequest
  ): Promise<ReadPostsResponse> {
    let [rows] = await this.coreDatabase.run(
      buildQueryNewPostsStatement(request.userSession.userId)
    );
    let postEntryCards = new Array<PostEntryCard>();
    for (let row of rows) {
      let postEntryRow = parseQueryNewPostsRow(row);
      if (postEntryRow.expirationTimestamp >= this.getNow()) {
        postEntryCards.push({
          postEntryId: postEntryRow.postEntryId,
          repliedEntryId: postEntryRow.repliedEntryId,
          userId: postEntryRow.userId,
          username: postEntryRow.username,
          userNatureName: postEntryRow.naturalName,
          userPictureUrl: postEntryRow.pictureUrl,
          content: postEntryRow.content,
          createdTimestamp: postEntryRow.createdTimestamp,
        });
      }
    }
    return {
      postEntryCards,
    };
  }
}
