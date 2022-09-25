import { PostEntryCard as PostEntry } from "../../../../interface/post_entry_card";
import { PostEntryListPage } from "./container";
import { PostEntryCard } from "./post_entry_card";

export class PostEntryCardMock extends PostEntryCard {
  public constructor(postEntry: PostEntry) {
    super(postEntry);
  }
}

export class PostEntryListPageMock extends PostEntryListPage {
  public constructor(public postEntriesToLoad: Array<PostEntry>) {
    super((postEntry) => new PostEntryCardMock(postEntry), undefined);
  }

  protected loadPostEntries(): Promise<Array<PostEntry>> {
    return Promise.resolve(this.postEntriesToLoad);
  }
}
