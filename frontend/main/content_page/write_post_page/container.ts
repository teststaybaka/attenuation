import { WarningTagType } from "../../../../interface/warning_tag_type";
import { FillButton, OutlineButton } from "../../common/button";
import { SCHEME } from "../../common/color_scheme";
import { createPlusIcon } from "../../common/icons";
import { LOCALIZED_TEXT } from "../../common/locales/localized_text";
import { OptionButton } from "../../common/option_button";
import { MARGIN } from "./constants";
import { QuickLayoutEditor } from "./quick_layout_editor/container";
import { NormalTag, WarningTag } from "./tags";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";

export class WritePostPage {
  private static OPTION_BUTTON_CUSTOM_STYLE = `box-sizing: border-box; width: 25rem; padding: 1.5rem 1rem; text-align: center; font-size: 1.6rem; line-height: 1.8rem; border: .1rem solid; border-radius: 1rem; cursor: pointer;`;

  public body: HTMLDivElement;
  private tags = new Array<NormalTag>();
  private tagsContainer: HTMLDivElement;
  private tagInput: HTMLInputElement;
  private addTagButton: HTMLDivElement;

  public constructor() {
    let quickOptionRef = new Ref<OptionButton>();
    let imageSeriesOptionRef = new Ref<OptionButton>();
    let longVideoOptionRef = new Ref<OptionButton>();
    let audioOptionRef = new Ref<OptionButton>();
    let textImageInterleavedOptionRef = new Ref<OptionButton>();
    let quickLayoutEditorRef = new Ref<QuickLayoutEditor>();
    let tagsContainerRef = new Ref<HTMLDivElement>();
    let tagInputRef = new Ref<HTMLInputElement>();
    let addTagButtonRef = new Ref<HTMLDivElement>();
    let warningTagNudityRef = new Ref<WarningTag>();
    let warningTagSpoilerRef = new Ref<WarningTag>();
    let warningTagGrossRef = new Ref<WarningTag>();
    this.body = E.div(
      {
        class: "write-post",
        style: `flex-flow: row nowrap; justify-content: center; width: 100vw;`,
      },
      E.div(
        {
          class: "write-post-card",
          style: `display: flex; flex-flow: column nowrap; box-sizing: border-box; width: 100%; max-width: 100rem; gap: ${MARGIN}; padding: ${MARGIN};`,
        },
        E.div(
          {
            class: "write-post-choose-layout-label",
            style: `font-size: 1.4rem; color: ${SCHEME.neutral0};`,
          },
          E.text(LOCALIZED_TEXT.chooseLayoutLabel)
        ),
        E.div(
          {
            class: "write-post-choose-layout",
            style: `display: flex; flex-flow: row wrap; width: 100%; gap: ${MARGIN};`,
          },
          assign(
            quickOptionRef,
            OptionButton.create(
              true,
              WritePostPage.OPTION_BUTTON_CUSTOM_STYLE,
              E.text(LOCALIZED_TEXT.quickLayoutOption)
            )
          ).body,
          assign(
            imageSeriesOptionRef,
            OptionButton.create(
              false,
              WritePostPage.OPTION_BUTTON_CUSTOM_STYLE,
              E.text(LOCALIZED_TEXT.imageSeriesOption)
            )
          ).body,
          assign(
            longVideoOptionRef,
            OptionButton.create(
              false,
              WritePostPage.OPTION_BUTTON_CUSTOM_STYLE,
              E.text(LOCALIZED_TEXT.longVideoOption)
            )
          ).body,
          assign(
            audioOptionRef,
            OptionButton.create(
              false,
              WritePostPage.OPTION_BUTTON_CUSTOM_STYLE,
              E.text(LOCALIZED_TEXT.audioOption)
            )
          ).body,
          assign(
            textImageInterleavedOptionRef,
            OptionButton.create(
              false,
              WritePostPage.OPTION_BUTTON_CUSTOM_STYLE,
              E.text(LOCALIZED_TEXT.textImageInterleavedOption)
            )
          ).body
        ),
        ...assign(quickLayoutEditorRef, QuickLayoutEditor.create()).bodies,
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
            style: `display: flex; flex-flow: row wrap; align-items: center; justify-content: center; margin-bottom: 10rem; gap: 4rem;`,
          },
          OutlineButton.create(
            false,
            E.text(LOCALIZED_TEXT.previewPostButtonLabel)
          ).body,
          FillButton.create(false, E.text(LOCALIZED_TEXT.submitPostButtonLabel))
            .body
        )
      )
    );
    this.tagsContainer = tagsContainerRef.val;
    this.tagInput = tagInputRef.val;
    this.addTagButton = addTagButtonRef.val;
    this.hide();

    this.tagInput.addEventListener("keydown", (event) =>
      this.tagInputkeydown(event)
    );
    this.addTagButton.addEventListener("click", () => this.addTag());
  }

  public static create(): WritePostPage {
    return new WritePostPage();
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

  public show(): void {
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
