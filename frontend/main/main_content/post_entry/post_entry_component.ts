import { PostEntry } from "../../../../interface/post_entry";
import { E } from "@selfage/element/factory";

export class PostEntryComponent {
  public body: HTMLDivElement;

  public constructor(postEntry: PostEntry) {
    this.body = E.div(
      {
        class: "post-entry",
      },
      E.text(postEntry.content)
    );
  }

  public static create(postEntry: PostEntry): PostEntryComponent {
    return new PostEntryComponent(postEntry);
  }
}
