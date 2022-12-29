import EventEmitter = require("events");
import { WarningTagType } from "../../../../interface/warning_tag_type";
import { FilledBlockingButton } from "../../common/blocking_button";
import { SCHEME } from "../../common/color_scheme";
import { createPlusIcon } from "../../common/icons";
import { LOCALIZED_TEXT } from "../../common/locales/localized_text";
import { newCreateTaleServiceRequest } from "../../common/tale_service_requests";
import { WEB_SERVICE_CLIENT } from "../../common/web_service_client";
import { MenuItem } from "../common/menu_item";
import { createBackMenuItem } from "../common/menu_items";
import { MARGIN } from "./constants";
import { QuickLayoutEditor } from "./quick_layout_editor/container";
import { NormalTag, WarningTag } from "./tags";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export interface WriteTalePage {
  on(event: "back", listener: () => void): this;
}

export class WriteTalePage extends EventEmitter {
  public body: HTMLDivElement;
  public menuBody: HTMLDivElement;
  // Visible for testing
  public tagInput: HTMLInputElement;
  public addTagButton: HTMLDivElement;
  public tags = new Array<NormalTag>();
  public warningTagNudity: WarningTag;
  public warningTagSpoiler: WarningTag;
  public warningTagGross: WarningTag;
  public submitButton: FilledBlockingButton;

  private tagsContainer: HTMLDivElement;
  private submitStatus: HTMLDivElement;
  private backMenuItem: MenuItem;

  public constructor(
    private quickLayoutEditor: QuickLayoutEditor,
    private webServiceClient: WebServiceClient
  ) {
    super();
    let tagsContainerRef = new Ref<HTMLDivElement>();
    let tagInputRef = new Ref<HTMLInputElement>();
    let addTagButtonRef = new Ref<HTMLDivElement>();
    let warningTagNudityRef = new Ref<WarningTag>();
    let warningTagSpoilerRef = new Ref<WarningTag>();
    let warningTagGrossRef = new Ref<WarningTag>();
    let submitButtonRef = new Ref<FilledBlockingButton>();
    let submitStatusRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "write-tale",
        style: `flex-flow: row nowrap; justify-content: center; width: 100vw;`,
      },
      E.div(
        {
          class: "write-tale-card",
          style: `display: flex; flex-flow: column nowrap; box-sizing: border-box; width: 100%; max-width: 100rem; gap: ${MARGIN}; padding: ${MARGIN} ${MARGIN} 10rem ${MARGIN};`,
        },
        ...quickLayoutEditor.bodies,
        E.div(
          {
            class: "write-tale-tags-label",
            style: `font-size: 1.4rem; color: ${SCHEME.neutral0};`,
          },
          E.text(LOCALIZED_TEXT.tagsLabel)
        ),
        E.divRef(
          tagsContainerRef,
          {
            class: "write-tale-tags",
            style: `display: flex; flex-flow: row wrap; align-items: center; gap: ${MARGIN};`,
          },
          E.div(
            {
              class: "write-tale-add-tag",
              style: `display: flex; flex-flow: row nowrap; align-items: center;`,
            },
            E.inputRef(tagInputRef, {
              class: "write-tale-add-tag-input",
              style: `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; font-size: 1.4rem; line-height: 3rem; width: 8rem; border-bottom: .1rem solid ${SCHEME.neutral2};`,
            }),
            E.divRef(
              addTagButtonRef,
              {
                class: "write-tale-add-tag-button",
                style: `height: 3rem; width: 3rem; padding: .5rem; box-sizing: border-box; margin-left: .5rem;`,
              },
              createPlusIcon(SCHEME.neutral1)
            )
          )
        ),
        E.div(
          {
            class: "write-tale-warning-tags-label",
            style: `font-size: 1.4rem; color: ${SCHEME.neutral0};`,
          },
          E.text(LOCALIZED_TEXT.warningTagsLabel)
        ),
        E.div(
          {
            class: "write-tale-warning-tags",
            style: `display: flex; flex-flow: row wrap; algin-items: center; gap: ${MARGIN};`,
          },
          assign(
            warningTagNudityRef,
            WarningTag.create(
              WarningTagType.Nudity,
              LOCALIZED_TEXT.warningTagNudity
            )
          ).body,
          assign(
            warningTagSpoilerRef,
            WarningTag.create(
              WarningTagType.Spoiler,
              LOCALIZED_TEXT.warningTagSpoiler
            )
          ).body,
          assign(
            warningTagGrossRef,
            WarningTag.create(
              WarningTagType.Gross,
              LOCALIZED_TEXT.warningTagGross
            )
          ).body
        ),
        E.div(
          {
            class: "write-tale-finalizing-button",
            style: `align-self: center;`,
          },
          assign(
            submitButtonRef,
            FilledBlockingButton.create(
              false,
              E.text(LOCALIZED_TEXT.submitTaleButtonLabel)
            )
          ).body
        ),
        E.divRef(submitStatusRef, {
          class: "write-tale-submit-status",
          style: `display: none; align-self: center; font-size: 1.4rem; color: ${SCHEME.error0};`,
        })
      )
    );
    this.tagsContainer = tagsContainerRef.val;
    this.tagInput = tagInputRef.val;
    this.addTagButton = addTagButtonRef.val;
    this.warningTagNudity = warningTagNudityRef.val;
    this.warningTagSpoiler = warningTagSpoilerRef.val;
    this.warningTagGross = warningTagGrossRef.val;
    this.submitButton = submitButtonRef.val;
    this.submitStatus = submitStatusRef.val;

    this.backMenuItem = createBackMenuItem(false);
    this.menuBody = this.backMenuItem.body;

    this.hide();
    this.quickLayoutEditor.on("valid", () => this.enableButtons());
    this.quickLayoutEditor.on("invalid", () => this.disableButtons());
    this.tagInput.addEventListener("keydown", (event) =>
      this.tagInputkeydown(event)
    );
    this.addTagButton.addEventListener("click", () => this.addTag());
    this.submitButton.on("action", () => this.submitTale());
    this.submitButton.on("postAction", (e) => this.postSubmitTale(e));
    this.backMenuItem.on("action", () => this.emit("back"));
  }

  public static create(): WriteTalePage {
    return new WriteTalePage(QuickLayoutEditor.create(), WEB_SERVICE_CLIENT);
  }

  private enableButtons(): void {
    this.submitButton.enable();
  }

  private disableButtons(): void {
    this.submitButton.disable();
  }

  private tagInputkeydown(event: KeyboardEvent): void {
    if (event.code !== "Enter") {
      return;
    }
    this.addTagButton.click();
  }

  private addTag(): void {
    if (!this.tagInput.value) {
      return;
    }

    let tag = NormalTag.create(this.tagInput.value);
    this.tags.push(tag);
    this.tagsContainer.insertBefore(
      tag.body,
      this.tagsContainer.lastElementChild
    );
    tag.on("delete", () => this.removeTag(tag));
    this.tagInput.value = "";
  }

  private removeTag(tag: NormalTag): void {
    this.tags.splice(this.tags.indexOf(tag), 1);
    tag.body.remove();
  }

  private async submitTale(): Promise<void> {
    this.submitStatus.style.display = "none";
    let warningTags = new Array<WarningTagType>();
    if (this.warningTagNudity.selected) {
      warningTags.push(this.warningTagNudity.warningTagType);
    }
    if (this.warningTagSpoiler.selected) {
      warningTags.push(this.warningTagSpoiler.warningTagType);
    }
    if (this.warningTagGross.selected) {
      warningTags.push(this.warningTagGross.warningTagType);
    }
    await this.webServiceClient.send(
      newCreateTaleServiceRequest({
        body: {
          quickLayoutTale: {
            text: this.quickLayoutEditor.textInput.value,
            images: this.quickLayoutEditor.imageEditors.map(
              (imageEditor) => imageEditor.imageUrl
            ),
          },
          tags: this.tags.map((tag) => tag.text),
          warningTags,
        },
      })
    );
  }

  private postSubmitTale(e?: Error): void {
    if (e) {
      this.submitStatus.textContent = LOCALIZED_TEXT.submitTaleFailed;
      this.submitStatus.style.display = "block";
      console.error(e);
      return;
    }

    this.quickLayoutEditor.clear();
    while (this.tags.length > 0) {
      this.removeTag(this.tags[this.tags.length - 1]);
    }
    this.warningTagNudity.unselect();
    this.warningTagSpoiler.unselect();
    this.warningTagGross.unselect();
  }

  public show(): void {
    this.backMenuItem.show();
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.backMenuItem.hide();
    this.body.style.display = "none";
  }
}
