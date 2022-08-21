import { PostEntryCard } from "../../../../interface/post_entry_card";
import { newReadPostsServiceRequest } from "../../../common/client_requests";
import { WEB_SERVICE_CLIENT } from "../../web_service_client";
import { PostEntryCardComponent } from "./post_entry_card/component";
import { E } from "@selfage/element/factory";
import { WebServiceClient } from "@selfage/web_service_client";

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
    ) => PostEntryCardComponent,
    private webSerivceClient: WebServiceClient
  ) {
    this.body = E.div({
      class: "post-entry-list",
      style: `flex-flow: column wrap; height: 100%; width: 100%; overflow: hidden;`,
    });
  }

  public static create(): PostEntryListComponent {
    return new PostEntryListComponent(
      PostEntryCardComponent.create,
      WEB_SERVICE_CLIENT
    ).init();
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

  public async refresh(): Promise<void> {
    let response = await this.webSerivceClient.send(
      newReadPostsServiceRequest({ body: {} })
    );
    this.removeAllEntries();
    this.addEntries(response.postEntryCards);
  }

  private removeAllEntries(): void {
    for (let entry of this.postEntryCardComponents.entries()) {
      entry[1][0].remove();
    }
    this.postEntryCardComponents.clear();
  }

  private addEntries(postEntryCards: Array<PostEntryCard>): void {
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

  public show(): void {
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
