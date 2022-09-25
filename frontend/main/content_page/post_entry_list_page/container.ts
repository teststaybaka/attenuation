import EventEmitter = require("events");
import { PostEntryCard as PostEntry } from "../../../../interface/post_entry_card";
import { newReadPostsServiceRequest } from "../../common/client_requests";
import { WEB_SERVICE_CLIENT } from "../../common/web_service_client";
import { MenuContainer } from "../common/menu_container";
import { MenuItem } from "../common/menu_item";
import {
  createAccountMenuItem,
  createRefreshMenuItem,
  createWritePostMenuItem,
} from "../common/menu_items";
import { PostEntryCard } from "./post_entry_card";
import { E } from "@selfage/element/factory";
import { WebServiceClient } from "@selfage/web_service_client";

export interface PostEntryListPage {
  on(event: "account", listener: () => void): this;
}

export class PostEntryListPage extends EventEmitter {
  public body: HTMLDivElement;
  public menuBodies = new Array<HTMLDivElement>();
  private cardWidth = "100%";
  private postEntryCards = new Map<string, [HTMLDivElement, PostEntryCard]>();
  private writeMenuItem: MenuItem;
  private refreshPostsMenuItem: MenuItem;
  private accountMenuItem: MenuItem;
  private menuContainer: MenuContainer;

  public constructor(
    private postEntryCardFactoryFn: (postEntry: PostEntry) => PostEntryCard,
    private webSerivceClient: WebServiceClient
  ) {
    super();
    this.body = E.div({
      class: "post-entry-list",
      style: `flex-flow: column wrap; width: 100%; height: 100vh; overflow: hidden;`,
    });
    this.writeMenuItem = createWritePostMenuItem();
    this.refreshPostsMenuItem = createRefreshMenuItem();
    this.accountMenuItem = createAccountMenuItem();
    this.menuContainer = MenuContainer.create(
      this.writeMenuItem,
      this.refreshPostsMenuItem,
      this.accountMenuItem
    );
    this.menuBodies.push(this.menuContainer.body);

    this.accountMenuItem.on("action", () => this.emit("account"));
    this.refreshPostsMenuItem.on("action", () => this.refresh());
    let observer = new ResizeObserver((entries) => {
      this.resize(entries[0]);
    });
    observer.observe(this.body);
    this.hide();
  }

  public static create(): PostEntryListPage {
    return new PostEntryListPage(PostEntryCard.create, WEB_SERVICE_CLIENT);
  }

  private resize(entry: ResizeObserverEntry): void {
    if (entry.contentRect.width > 1950) {
      this.cardWidth = "33.5%";
    } else if (entry.contentRect.width > 1300) {
      this.cardWidth = "50%";
    } else {
      this.cardWidth = "100%";
    }
    for (let [wrapper] of this.postEntryCards.values()) {
      wrapper.style.width = this.cardWidth;
    }
  }

  public async refresh(): Promise<void> {
    let postEntries = await this.loadPostEntries();
    this.removeAllEntries();
    this.addEntries(postEntries);
  }

  protected async loadPostEntries(): Promise<Array<PostEntry>> {
    return (
      await this.webSerivceClient.send(newReadPostsServiceRequest({ body: {} }))
    ).postEntryCards;
  }

  private removeAllEntries(): void {
    for (let entry of this.postEntryCards.entries()) {
      entry[1][0].remove();
    }
    this.postEntryCards.clear();
  }

  private addEntries(postEntries: Array<PostEntry>): void {
    for (let postEntry of postEntries) {
      if (this.postEntryCards.has(postEntry.postEntryId)) {
        continue;
      }

      let postEntryCardComponent = this.postEntryCardFactoryFn(postEntry);
      let wrapper = E.div(
        {
          class: "post-entry-card-wrapper",
          style: `width: ${this.cardWidth};`,
        },
        postEntryCardComponent.body
      );
      this.body.appendChild(wrapper);
      this.postEntryCards.set(postEntry.postEntryId, [
        wrapper,
        postEntryCardComponent,
      ]);
    }
  }

  public show(): void {
    this.menuContainer.expand();
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.menuContainer.collapse();
    this.body.style.display = "none";
  }
}
