import EventEmitter = require("events");
import { PostEntry } from "../../../interface/post_entry";
import { READ_POSTS } from "../../../interface/service";
import { SERVICE_CLIENT } from "../service_client";
import { PostEntryComponent } from "./post_entry/post_entry_component";
import { E } from "@selfage/element/factory";
import { ServiceClient } from "@selfage/service_client";

export interface MainContentComponent {
  on(event: "signOut", listener: () => void): this;
}

export class MainContentComponent extends EventEmitter {
  public body: HTMLDivElement;

  public constructor(
    private serivceClient: ServiceClient,
    private postEntryComponentFactoryFn: (
      postEntry: PostEntry
    ) => PostEntryComponent
  ) {
    super();
    this.body = E.div({
      class: "main-content",
    });
  }

  public static create(): MainContentComponent {
    return new MainContentComponent(SERVICE_CLIENT, PostEntryComponent.create);
  }

  public async show(): Promise<void> {
    let response = await this.serivceClient.fetchAuthed({}, READ_POSTS);
    for (let postEntry of response.postEntries) {
      this.body.appendChild(this.postEntryComponentFactoryFn(postEntry).body);
    }
  }

  public remove(): void {
    this.body.remove();
  }
}
