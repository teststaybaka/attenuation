import { PostEntryCard } from "../../../../interface/post_entry_card";
import { PostEntryCardComponent } from "./post_entry_card/component";
import { E } from "@selfage/element/factory";

export class PostEntryListComponent {
  public body: HTMLDivElement;
  private width = "100%";
  private postEntryCardComponents = new Map<
    string,
    [HTMLDivElement, PostEntryCardComponent]
  >();

  public constructor(
    private postEntryCardComponentFactoryFn: (
      postEntryCard: PostEntryCard
    ) => PostEntryCardComponent
  ) {
    this.body = E.div({
      class: "post-entry-list",
      style: `display: flex; flex-flow: column wrap; height: 100%; width: 100%; overflow: hidden;`,
    });
  }

  public static create(): PostEntryListComponent {
    return new PostEntryListComponent(PostEntryCardComponent.create).init();
  }

  public init(): this {
    let observer = new ResizeObserver((entries) => {
      this.resize(entries[0]);
    });
    observer.observe(this.body);
    return this;
  }

  private resize(entry: ResizeObserverEntry): void {
    if (entry.contentRect.width > 1950) {
      this.width = "33.3%";
    } else if (entry.contentRect.width > 1300) {
      this.width = "50%";
    } else {
      this.width = "100%";
    }
    for (let [wrapper] of this.postEntryCardComponents.values()) {
      wrapper.style.width = this.width;
    }
  }

  public addEntries(postEntryCards: Array<PostEntryCard>): void {
    for (let postEntryCard of postEntryCards) {
      if (this.postEntryCardComponents.has(postEntryCard.postEntryId)) {
        continue;
      }

      let postEntryCardComponent =
        this.postEntryCardComponentFactoryFn(postEntryCard);
      let wrapper = E.div(
        {
          class: "post-entry-card-wrapper",
          style: `width: ${this.width};`,
        },
        postEntryCardComponent.body
      );
      this.body.appendChild(wrapper);
      this.postEntryCardComponents.set(postEntryCard.postEntryId, [
        wrapper,
        postEntryCardComponent,
      ]);
    }
  }
}
