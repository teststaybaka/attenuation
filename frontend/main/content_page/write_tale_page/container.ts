import { WarningTagType } from "../../../../interface/warning_tag_type";
import { FillButton, OutlineButton } from "../../common/button";
import { SCHEME } from "../../common/color_scheme";
import { createPlusIcon } from "../../common/icons";
import { LOCALIZED_TEXT } from "../../common/locales/localized_text";
import { newCreateTaleServiceRequest } from "../../common/tale_service_requests";
import { WEB_SERVICE_CLIENT } from "../../common/web_service_client";
import { MARGIN } from "./constants";
import { QuickLayoutEditor } from "./quick_layout_editor/container";
import { NormalTag, WarningTag } from "./tags";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export class WriteTalePage {
  public bodies: Array<HTMLDivElement>;
  private body: HTMLDivElement;
  private tags = new Array<NormalTag>();
  private tagsContainer: HTMLDivElement;
  private tagInput: HTMLInputElement;
  private addTagButton: HTMLDivElement;
  private warningTagNudity: WarningTag;
  private warningTagSpoiler: WarningTag;
  private warningTagGross: WarningTag;
  private submitStatus: HTMLDivElement;

  public constructor(
    private quickLayoutEditor: QuickLayoutEditor,
    private previewButton: OutlineButton,
    private submitButton: FillButton,
    private webServiceClient: WebServiceClient
  ) {
    let tagsContainerRef = new Ref<HTMLDivElement>();
    let tagInputRef = new Ref<HTMLInputElement>();
    let addTagButtonRef = new Ref<HTMLDivElement>();
    let warningTagNudityRef = new Ref<WarningTag>();
    let warningTagSpoilerRef = new Ref<WarningTag>();
    let warningTagGrossRef = new Ref<WarningTag>();
    let submitStatusRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "write-post",
        style: `flex-flow: row nowrap; justify-content: center; width: 100vw;`,
      },
      E.div(
        {
          class: "write-post-card",
          style: `display: flex; flex-flow: column nowrap; box-sizing: border-box; width: 100%; max-width: 100rem; gap: ${MARGIN}; padding: ${MARGIN} ${MARGIN} 10rem ${MARGIN};`,
        },
        ...quickLayoutEditor.bodies,
        E.div(
          {
            class: "write-post-tags-label",
            style: `font-size: 1.4rem; color: ${SCHEME.neutral0};`,
          },
          E.text(LOCALIZED_TEXT.tagsLabel)
        ),
        E.divRef(
          tagsContainerRef,
          {
            class: "write-post-tags",
            style: `display: flex; flex-flow: row wrap; align-items: center; gap: ${MARGIN};`,
          },
          E.div(
            {
              class: "write-post-add-tag",
              style: `display: flex; flex-flow: row nowrap; align-items: center;`,
            },
            E.inputRef(tagInputRef, {
              class: "write-post-add-tag-input",
              style: `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; font-size: 1.4rem; line-height: 3rem; width: 8rem; border-bottom: .1rem solid ${SCHEME.neutral2};`,
            }),
            E.divRef(
              addTagButtonRef,
              {
                class: "write-post-add-tag-button",
                style: `height: 3rem; margin-left: .5rem;`,
              },
              createPlusIcon(SCHEME.neutral1)
            )
          )
        ),
        E.div(
          {
            class: "write-post-warning-tags-label",
            style: `font-size: 1.4rem; color: ${SCHEME.neutral0};`,
          },
          E.text(LOCALIZED_TEXT.warningTagsLabel)
        ),
        E.div(
          {
            class: "write-post-warning-tags",
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
            class: "write-post-finalizing-buttons",
            style: `display: flex; flex-flow: row wrap; align-items: center; justify-content: center; gap: 4rem;`,
          },
          previewButton.body,
          submitButton.body
        ),
        E.divRef(submitStatusRef, {
          class: "write-post-submit-status",
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
    this.submitStatus = submitStatusRef.val;
    this.bodies = [this.body];

    this.hide();
    this.quickLayoutEditor.on("valid", () => this.enableButtons());
    this.quickLayoutEditor.on("invalid", () => this.disableButtons());
    this.tagInput.addEventListener("keydown", (event) =>
      this.tagInputkeydown(event)
    );
    this.addTagButton.addEventListener("click", () => this.addTag());
    this.submitButton.on("click", () => this.submitPost());
    this.submitButton.on("afterClick", (e) => this.afterSubmitPost(e));
  }

  public static create(): WriteTalePage {
    return new WriteTalePage(
      QuickLayoutEditor.create(),
      OutlineButton.create(
        false,
        E.text(LOCALIZED_TEXT.previewPostButtonLabel)
      ),
      FillButton.create(false, E.text(LOCALIZED_TEXT.submitPostButtonLabel)),
      WEB_SERVICE_CLIENT
    );
  }

  private enableButtons(): void {
    this.previewButton.enable();
    this.submitButton.enable();
  }

  private disableButtons(): void {
    this.previewButton.disable();
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

  private async submitPost(): Promise<void> {
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

  private afterSubmitPost(e?: Error): void {
    if (e) {
      this.submitStatus.textContent = LOCALIZED_TEXT.submitPostFailed;
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
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
