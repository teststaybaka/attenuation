import EventEmitter = require("events");
import { UploadImageForTaleResponse } from "../../../../../interface/tale_service";
import { SCHEME } from "../../../common/color_scheme";
import { createPlusIcon } from "../../../common/icons";
import { LOCALIZED_TEXT } from "../../../common/locales/localized_text";
import { newUploadImageForTaleServiceRequest } from "../../../common/tale_service_requests";
import { WEB_SERVICE_CLIENT } from "../../../common/web_service_client";
import { MARGIN } from "../constants";
import { ImageEditor } from "./image_editor";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export interface QuickLayoutEditor {
  on(event: "valid", listener: () => void): this;
  on(event: "invalid", listener: () => void): this;
}

export class QuickLayoutEditor extends EventEmitter {
  private static CHARACTER_LIMIT = 700;
  private static IMAGE_NUMBER_LIMIT = 9;

  public bodies: Array<HTMLDivElement>;
  public textInput: HTMLTextAreaElement;
  public valid = false;
  public imageEditors = new Array<ImageEditor>();
  private characterCountContainer: HTMLDivElement;
  private characterCount: HTMLDivElement;
  private uploadImagesContainer: HTMLDivElement;
  private uploadImageButton: HTMLDivElement;
  private uploadImageError: HTMLDivElement;

  public constructor(
    private imageEditorFactoryFn: (imageUrl: string) => ImageEditor,
    private webServiceClient: WebServiceClient
  ) {
    super();
    let textInputRef = new Ref<HTMLTextAreaElement>();
    let characterCountContainerRef = new Ref<HTMLDivElement>();
    let characterCountRef = new Ref<HTMLDivElement>();
    let uploadImagesContainerRef = new Ref<HTMLDivElement>();
    let uploadImageButtonRef = new Ref<HTMLDivElement>();
    let uploadImageErrorRef = new Ref<HTMLDivElement>();
    this.bodies = [
      E.div(
        {
          class: "quick-layout-text-input-label",
          style: `font-size: 1.4rem; color: ${SCHEME.neutral0};`,
        },
        E.text(LOCALIZED_TEXT.quickLayoutTextLabel)
      ),
      E.div(
        {
          class: "quick-layout-text-input-editor",
          style: `display: flex; flex-flow: column nowrap;`,
        },
        E.textareaRef(textInputRef, {
          class: "quick-layout-text-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; width: 100%; font-size: 1.4rem; font-family: initial; line-height: 2rem; color: ${SCHEME.neutral0}; border-bottom: .1rem solid ${SCHEME.neutral2}; resize: none;`,
          rows: "4",
        }),
        E.divRef(
          characterCountContainerRef,
          {
            class: "quick-layout-text-input-hints",
            style: `display: flex; flex-flow: row nowrap; align-self: flex-end; align-items: center; height: 1.6rem;`,
          },
          E.div(
            {
              class: "quick-layout-text-input-character-count-label",
              style: `font-size: 1.2rem; margin-right: .2rem;`,
            },
            E.text(LOCALIZED_TEXT.characterCountLabel)
          ),
          E.divRef(characterCountRef, {
            class: "quick-layout-text-input-character-count-number",
            style: `font-size: 1.2rem;`,
          })
        )
      ),
      E.div(
        {
          class: "quick-layout-upload-image-label",
          style: `font-size: 1.4rem; color: ${SCHEME.neutral0};`,
        },
        E.text(LOCALIZED_TEXT.quickLayoutUploadImagesLabel)
      ),
      E.div(
        {
          class: "quick-layout-upload-images-with-error",
          style: `display: flex; flex-flow: column nowrap;`,
        },
        E.divRef(
          uploadImagesContainerRef,
          {
            class: "quick-layout-upload-images",
            style: `display: flex; flex-flow: row wrap; align-items: center; gap: ${MARGIN};`,
          },
          E.divRef(
            uploadImageButtonRef,
            {
              class: "quick-layout-upload-image-button",
              style: `display: flex; flex-flow: column nowrap; justify-content: center; align-items: center; box-sizing: border-box; width: 12rem; height: 18rem; border: .4rem dashed ${SCHEME.neutral2}; border-radius: 1rem; cursor: pointer;`,
            },
            E.div(
              {
                class: "quick-layout-upload-image-icon",
                style: `height: 4rem;`,
              },
              createPlusIcon(SCHEME.neutral1)
            ),
            E.div(
              {
                class: "quick-layout-upload-image-label",
                style: `margin: .5rem .5rem 0; font-size: 1.6rem; text-align: center; color: ${SCHEME.neutral0}; `,
              },
              E.text(LOCALIZED_TEXT.quickLayoutUploadImageButtonLabel)
            )
          )
        ),
        E.divRef(uploadImageErrorRef, {
          class: "quick-layout-upload-image-error",
          style: `align-self: center; margin-top: 1rem; font-size: 1.4rem; color: ${SCHEME.error0};`,
        })
      ),
    ];
    this.textInput = textInputRef.val;
    this.characterCountContainer = characterCountContainerRef.val;
    this.characterCount = characterCountRef.val;
    this.uploadImagesContainer = uploadImagesContainerRef.val;
    this.uploadImageButton = uploadImageButtonRef.val;
    this.uploadImageError = uploadImageErrorRef.val;
    this.countCharacter();

    this.textInput.addEventListener("input", () => this.countCharacter());
    this.uploadImageButton.addEventListener("click", () => this.chooseFile());
  }

  public static create(): QuickLayoutEditor {
    return new QuickLayoutEditor(ImageEditor.create, WEB_SERVICE_CLIENT);
  }

  private countCharacter(): void {
    this.characterCount.textContent = `${this.textInput.textLength}/${QuickLayoutEditor.CHARACTER_LIMIT}`;
    if (this.textInput.textLength <= QuickLayoutEditor.CHARACTER_LIMIT) {
      this.characterCountContainer.style.color = SCHEME.neutral2;
    } else {
      this.characterCountContainer.style.color = SCHEME.error0;
    }
    this.checkValidity();
  }

  private chooseFile(): void {
    let tempFileInput = E.input({ type: "file" });
    tempFileInput.addEventListener("input", () =>
      this.loadImages(tempFileInput)
    );
    tempFileInput.click();
  }

  private async loadImages(fileInput: HTMLInputElement): Promise<void> {
    this.uploadImageError.style.display = "none";
    let filesFailed = new Array<string>();
    let loading = new Array<Promise<void>>();
    for (let file of fileInput.files) {
      loading.push(this.uploadAndLoadImageOrCollectFailure(file, filesFailed));
    }
    await Promise.all(loading);

    if (filesFailed.length > 0) {
      this.uploadImageError.textContent = `${
        LOCALIZED_TEXT.quickLayoutUploadImageFailure1
      }${filesFailed.join()}${LOCALIZED_TEXT.quickLayoutUploadImageFailure2}`;
      this.uploadImageError.style.display = "block";
    }
    if (this.imageEditors.length >= QuickLayoutEditor.IMAGE_NUMBER_LIMIT) {
      this.uploadImageButton.style.display = "none";
    }
    this.checkValidity();
  }

  protected checkValidity(): void {
    if (
      (this.textInput.textLength > 0 &&
        this.textInput.textLength <= QuickLayoutEditor.CHARACTER_LIMIT) ||
      (this.imageEditors.length > 0 &&
        this.imageEditors.length <= QuickLayoutEditor.IMAGE_NUMBER_LIMIT)
    ) {
      this.valid = true;
      this.emit("valid");
    } else {
      this.valid = false;
      this.emit("invalid");
    }
  }

  private async uploadAndLoadImageOrCollectFailure(
    imageFile: File,
    filesFailed: Array<string>
  ): Promise<void> {
    let response: UploadImageForTaleResponse;
    try {
      response = await this.webServiceClient.send(
        newUploadImageForTaleServiceRequest({
          body: imageFile,
        })
      );
    } catch (e) {
      console.error(`Failed to upload ${imageFile.name}.`, e);
      filesFailed.push(imageFile.name);
      return;
    }
    if (this.imageEditors.length >= QuickLayoutEditor.IMAGE_NUMBER_LIMIT) {
      filesFailed.push(imageFile.name);
      return;
    }

    this.addImageEditor(response.url);
  }

  protected addImageEditor(iamgeUrl: string): void {
    let imageEditor = this.imageEditorFactoryFn(iamgeUrl);
    this.insertImageEditor(this.imageEditors.length, imageEditor);
    imageEditor.on("top", () => this.moveImageEditorToTop(imageEditor));
    imageEditor.on("up", () => this.moveImageEditorUp(imageEditor));
    imageEditor.on("down", () => this.moveImageEditorDown(imageEditor));
    imageEditor.on("bottom", () => this.moveImageEditorToBottom(imageEditor));
    imageEditor.on("delete", () => this.removeImageEditorForSure(imageEditor));
  }

  private insertImageEditor(position: number, imageEditor: ImageEditor) {
    if (this.imageEditors.length === 0) {
      imageEditor.hideMoveUpButtons();
      imageEditor.hideMoveDownButtons();
      this.uploadImagesContainer.insertBefore(
        imageEditor.body,
        this.uploadImageButton
      );
      this.imageEditors.push(imageEditor);
    } else {
      if (position === 0) {
        imageEditor.hideMoveUpButtons();
        imageEditor.showMoveDownButtons();
        this.imageEditors[0].showMoveUpButtons();
        this.uploadImagesContainer.prepend(imageEditor.body);
        this.imageEditors.splice(0, 0, imageEditor);
      } else if (position === this.imageEditors.length) {
        imageEditor.showMoveUpButtons();
        imageEditor.hideMoveDownButtons();
        this.imageEditors[this.imageEditors.length - 1].showMoveDownButtons();
        this.uploadImagesContainer.insertBefore(
          imageEditor.body,
          this.uploadImageButton
        );
        this.imageEditors.push(imageEditor);
      } else {
        imageEditor.showMoveUpButtons();
        imageEditor.showMoveDownButtons();
        this.uploadImagesContainer.insertBefore(
          imageEditor.body,
          this.imageEditors[position].body
        );
        this.imageEditors.splice(position, 0, imageEditor);
      }
    }
  }

  private removeImageEditorForSure(imageEditor: ImageEditor): void {
    this.removeImageEditor(imageEditor);
    this.uploadImageButton.style.display = "flex";
    this.checkValidity();
  }

  private removeImageEditor(imageEditor: ImageEditor): void {
    let position = this.imageEditors.indexOf(imageEditor);
    if (this.imageEditors.length > 1) {
      if (position === 0) {
        this.imageEditors[1].hideMoveUpButtons();
      } else if (position === this.imageEditors.length - 1) {
        this.imageEditors[this.imageEditors.length - 2].hideMoveDownButtons();
      }
    }
    this.imageEditors.splice(position, 1);
    imageEditor.body.remove();
  }

  private moveImageEditorToTop(imageEditor: ImageEditor): void {
    this.removeImageEditor(imageEditor);
    this.insertImageEditor(0, imageEditor);
  }

  private moveImageEditorUp(imageEditor: ImageEditor): void {
    let position = this.imageEditors.indexOf(imageEditor);
    let newPosition = Math.max(0, position - 1);
    this.removeImageEditor(imageEditor);
    this.insertImageEditor(newPosition, imageEditor);
  }

  private moveImageEditorDown(imageEditor: ImageEditor): void {
    let position = this.imageEditors.indexOf(imageEditor);
    let newPosition = Math.min(this.imageEditors.length - 1, position + 1);
    this.removeImageEditor(imageEditor);
    this.insertImageEditor(newPosition, imageEditor);
  }

  private moveImageEditorToBottom(imageEditor: ImageEditor): void {
    this.removeImageEditor(imageEditor);
    this.insertImageEditor(this.imageEditors.length, imageEditor);
  }

  public clear(): void {
    this.textInput.value = "";
    while (this.imageEditors.length > 0) {
      let imageEditor = this.imageEditors.pop();
      imageEditor.body.remove();
    }
    this.checkValidity();
  }
}
