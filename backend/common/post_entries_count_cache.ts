import { Reaction } from "../../interface/post_entry";

export class PostEntriesCountCache {
  private views = new Map<string, number>();
  private reacts = new Map<string, Map<Reaction, number>>();

  public incView(postEntryId: string): void {
    let entryViews = this.views.get(postEntryId) ?? 0;
    this.views.set(postEntryId, entryViews + 1);
  }

  public incReact(postEntryId: string, reaction: Reaction): void {
    let entryReaction = this.reacts.get(postEntryId);
    if (!entryReaction) {
      entryReaction = new Map<Reaction, number>();
      this.reacts.set(postEntryId, entryReaction);
    }
    let reactionCount = entryReaction.get(reaction) ?? 0;
    entryReaction.set(reaction, reactionCount + 1);
  }
}

export let POST_ENTRIES_COUNT_CACHE = new PostEntriesCountCache();
