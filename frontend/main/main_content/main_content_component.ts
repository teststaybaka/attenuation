import EventEmitter = require("events");
import { PostEntry } from "../../../interface/post_entry";
import { CREATE_POST, READ_POSTS } from "../../../interface/service";
import { FillButtonComponent } from "../../common/button_component";
import { ColorScheme } from "../../common/color_scheme";
import { LOCALIZED_TEXT } from "../locales/localized_text";
import { SERVICE_CLIENT } from "../service_client";
import { PostEntryComponent } from "./post_entry/post_entry_component";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export interface MainContentComponent {
  on(event: "signOut", listener: () => void): this;
}

export class MainContentComponent extends EventEmitter {
  public body: HTMLDivElement;
  private postEntryList: HTMLDivElement;
  private postEntryContentInput: HTMLInputElement;

  public constructor(
    private sendButton: FillButtonComponent,
    private serivceClient: ServiceClient,
    private postEntryComponentFactoryFn: (
      postEntry: PostEntry
    ) => PostEntryComponent
  ) {
    super();
    let postEntryListRef = new Ref<HTMLDivElement>();
    let postEntryContentInputRef = new Ref<HTMLInputElement>();
    this.body = E.div(
      {
        class: "main-content",
        style: `display: flex; flex-flow: column nowrap; justify-content: space-between; align-items: center; width: 100vw; height: 100vh;`,
      },
      E.divRef(postEntryListRef, {
        class: "post-entries-list",
        style: `flex: 1 0 0; margin: 1rem 5rem; display: flex; flex-flow: column nowrap; justify-content: flex-start;`,
      }),
      E.div(
        {
          class: "post-entry-input-line",
          style: `flex: 0 0 auto; display: flex; flex-flow: row nowrap; justify-content: center; align-items: center; width: 100%;`,
        },
        E.inputRef(postEntryContentInputRef, {
          class: "post-entry-content-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; flex: 0 0 auto; margin: 0 5rem; color: ${ColorScheme.SCHEME.normalText}; font-size: 1.6rem; line-height: 2.2rem; border-bottom: .1rem solid ${ColorScheme.SCHEME.inputBorder};`,
        }),
        E.div(
          {
            class: "send-post-entry-button-wrapper",
            style: `margin-right: 5rem;`,
          },
          sendButton.body
        )
      )
    );
    this.postEntryList = postEntryListRef.val;
    this.postEntryContentInput = postEntryContentInputRef.val;
  }

  public static create(): MainContentComponent {
    return new MainContentComponent(
      FillButtonComponent.create(
        true,
        E.text(LOCALIZED_TEXT.sendPostEntryButtonLabel)
      ),
      SERVICE_CLIENT,
      PostEntryComponent.create
    ).init();
  }

  public init(): this {
    this.sendButton.on("click", () => this.send());
    return this;
  }

  private async send(): Promise<void> {
    let response = await this.serivceClient.fetchAuthed(
      { content: this.postEntryContentInput.value },
      CREATE_POST
    );
    this.postEntryList.appendChild(
      this.postEntryComponentFactoryFn(response.postEntry).body
    );
  }

  public async show(): Promise<void> {
    let response = await this.serivceClient.fetchAuthed({}, READ_POSTS);
    for (let postEntry of response.postEntries) {
      this.postEntryList.appendChild(
        this.postEntryComponentFactoryFn(postEntry).body
      );
    }
  }

  public remove(): void {
    this.body.remove();
  }
}
