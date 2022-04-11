import { Reaction } from "../../interface/post_entry";

interface PostEntryCounter {
  views: number,
  upvotes: number,
}

export class PostEntriesCountCache {
  public counters = new Map<string, PostEntryCounter>();

  public incView(postEntryId: string): void {
    let counter = this.getCounter(postEntryId);
    counter.views += 1;
  }

  private getCounter(postEntryId: string): PostEntryCounter {
    let counter = this.counters.get(postEntryId);
    if (!counter) {
      counter = {
        views: 0,
        upvotes: 0,
      };
      this.counters.set(postEntryId, counter);
    }
    return counter;
  }

  public incReact(postEntryId: string, reaction: Reaction): void {
    let counter = this.counters.get(postEntryId);
    switch (reaction) {
      case Reaction.UPVOTE:
        counter.upvotes += 1;
        break;
    }
  }
}

export let POST_ENTRIES_COUNT_CACHE = new PostEntriesCountCache();
