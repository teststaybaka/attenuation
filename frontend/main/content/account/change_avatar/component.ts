import {
  FillButtonComponent,
  OutlineButtonComponent,
} from "../../../common/button/component";
import { newUploadAvatarServiceRequest } from "../../../common/client_requests";
import { SCHEME } from "../../../common/color_scheme";
import { LOCALIZED_TEXT } from "../../../common/locales/localized_text";
import { WEB_SERVICE_CLIENT } from "../../../web_service_client";
import { AvatarCanvasComponent } from "./avatar_canvas/component";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export class ChangeAvatarComponent {
  private static LARGE_IMAGE_LENGTH = 160;
  private static SMALL_IMAGE_LENGTH = 50;

  public body: HTMLDivElement;
  private loadErrorText: HTMLDivElement;
  private previewLargeCanvas: HTMLCanvasElement;
  private previewSmallCanvas: HTMLCanvasElement;
  private uploadStatusText: HTMLDivElement;
  private fileInput = E.input({ type: "file" });

  public constructor(
    private avatarCanvasComponent: AvatarCanvasComponent,
    private chooseFileButton: OutlineButtonComponent,
    private uploadButton: FillButtonComponent,
    private serviceClient: WebServiceClient
  ) {
    let loadErrorTextRef = new Ref<HTMLDivElement>();
    let previewLargeCanvasRef = new Ref<HTMLCanvasElement>();
    let previewSmallCanvasRef = new Ref<HTMLCanvasElement>();
    let uploadStatusTextRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "change-avatar",
        style: `flex-flow: column nowrap; align-items: center; width: 100%; padding: 3rem 0 5rem;`,
      },
      chooseFileButton.body,
      E.divRef(loadErrorTextRef, {
        class: "change-avatar-image-load-error",
        style: `display: none; margin-top: 1rem; font-size: 1.4rem; color: ${SCHEME.errorText};`,
      }),
      E.div(
        {
          class: "change-avatar-canvas-wrapper",
          style: `margin: 3rem 0; width: 46rem; height: 46rem;`,
        },
        avatarCanvasComponent.body
      ),
      E.div(
        {
          class: "change-avatar-preview-label",
          style: `font-size: 1.4rem; color: ${SCHEME.normalText};`,
        },
        E.text(LOCALIZED_TEXT.previewAvatarLabel)
      ),
      E.div(
        {
          class: "change-avatar-preview-line",
          style: `display: flex; flex-flow: row nowrap; width: 100%; margin: 2rem 0 3rem; justify-content: center; align-items: flex-end;`,
        },
        E.div(
          {
            class: "change-avatar-preview-large-container",
            style: `display: flex; flex-flow: column nowrap; align-items: center; margin-right: 5rem;`,
          },
          E.div(
            {
              class: "change-avatar-preview-large-cap",
              style: `position: relative; width: ${ChangeAvatarComponent.LARGE_IMAGE_LENGTH}px; height: ${ChangeAvatarComponent.LARGE_IMAGE_LENGTH}px; border-radius: ${ChangeAvatarComponent.LARGE_IMAGE_LENGTH}px; border: .1rem solid ${SCHEME.inputBorder}; overflow: hidden;`,
            },
            E.canvasRef(previewLargeCanvasRef, {
              class: "change-avatar-preview-large-canvas",
              style: `position: absolute;`,
            })
          ),
          E.div(
            {
              class: "change-avatar-preview-large-label",
              style: `font-size: 1.4rem; color: ${SCHEME.normalText}; margin-top: 2rem;`,
            },
            E.text("160 x 160")
          )
        ),
        E.div(
          {
            class: "change-avatar-preview-large-container",
            style: `display: flex; flex-flow: column nowrap; align-items: center;`,
          },
          E.div(
            {
              class: "change-avatar-preview-small-cap",
              style: `position: relative; width: ${ChangeAvatarComponent.SMALL_IMAGE_LENGTH}px; height: ${ChangeAvatarComponent.SMALL_IMAGE_LENGTH}px; border-radius: ${ChangeAvatarComponent.SMALL_IMAGE_LENGTH}px; border: .1rem solid ${SCHEME.inputBorder}; overflow: hidden;`,
            },
            E.canvasRef(previewSmallCanvasRef, {
              class: "change-vatar-preview-small-canvas",
              style: `position: absolute;`,
            })
          ),
          E.div(
            {
              class: "change-avatar-preview-small-label",
              style: `font-size: 1.4rem; color: ${SCHEME.normalText}; margin-top: 2rem;`,
            },
            E.text("50 x 50")
          )
        )
      ),
      uploadButton.body,
      E.divRef(uploadStatusTextRef, {
        class: "change-avatar-upload-status-text",
        style: `display: none; font-size: 1.4rem; margin-top: 1rem;`,
      })
    );
    this.loadErrorText = loadErrorTextRef.val;
    this.previewLargeCanvas = previewLargeCanvasRef.val;
    this.previewSmallCanvas = previewSmallCanvasRef.val;
    this.uploadStatusText = uploadStatusTextRef.val;
  }

  public static create(): ChangeAvatarComponent {
    return new ChangeAvatarComponent(
      AvatarCanvasComponent.create(),
      OutlineButtonComponent.create(
        true,
        E.text(LOCALIZED_TEXT.chooseAvatarLabel)
      ),
      FillButtonComponent.create(
        false,
        E.text(LOCALIZED_TEXT.uploadAvatarLabel)
      ),
      WEB_SERVICE_CLIENT
    ).init();
  }

  public init(): this {
    this.hide();
    this.chooseFileButton.on("click", () => this.chooseFile());
    this.fileInput.addEventListener("input", () => this.load());
    this.avatarCanvasComponent.on("change", () => this.preview());
    this.uploadButton.on("click", () => this.uploadAvatar());
    return this;
  }

  private chooseFile(): void {
    this.fileInput.click();
  }

  private async load(): Promise<void> {
    this.loadErrorText.style.display = "none";
    try {
      await this.avatarCanvasComponent.load(this.fileInput.files[0]);
    } catch (e) {
      this.loadErrorText.textContent = LOCALIZED_TEXT.loadImageError;
      this.loadErrorText.style.display = "block";
      console.error(e);
      return;
    }

    this.previewLargeCanvas.width = this.avatarCanvasComponent.canvas.width;
    this.previewLargeCanvas.height = this.avatarCanvasComponent.canvas.height;
    this.previewLargeCanvas
      .getContext("2d")
      .drawImage(this.avatarCanvasComponent.canvas, 0, 0);
    this.previewSmallCanvas.width = this.avatarCanvasComponent.canvas.width;
    this.previewSmallCanvas.height = this.avatarCanvasComponent.canvas.height;
    this.previewSmallCanvas
      .getContext("2d")
      .drawImage(this.avatarCanvasComponent.canvas, 0, 0);
    this.uploadButton.enable();
  }

  public preview(): void {
    this.previewLargeCanvas.style.width = `${
      (this.avatarCanvasComponent.canvas.width /
        this.avatarCanvasComponent.sWidth) *
      ChangeAvatarComponent.LARGE_IMAGE_LENGTH
    }px`;
    this.previewLargeCanvas.style.height = `${
      (this.avatarCanvasComponent.canvas.height /
        this.avatarCanvasComponent.sHeight) *
      ChangeAvatarComponent.LARGE_IMAGE_LENGTH
    }px`;
    this.previewLargeCanvas.style.left = `-${
      (this.avatarCanvasComponent.sx / this.avatarCanvasComponent.sWidth) *
      ChangeAvatarComponent.LARGE_IMAGE_LENGTH
    }px`;
    this.previewLargeCanvas.style.top = `-${
      (this.avatarCanvasComponent.sy / this.avatarCanvasComponent.sHeight) *
      ChangeAvatarComponent.LARGE_IMAGE_LENGTH
    }px`;
    this.previewSmallCanvas.style.width = `${
      (this.avatarCanvasComponent.canvas.width /
        this.avatarCanvasComponent.sWidth) *
      ChangeAvatarComponent.SMALL_IMAGE_LENGTH
    }px`;
    this.previewSmallCanvas.style.height = `${
      (this.avatarCanvasComponent.canvas.height /
        this.avatarCanvasComponent.sHeight) *
      ChangeAvatarComponent.SMALL_IMAGE_LENGTH
    }px`;
    this.previewSmallCanvas.style.left = `-${
      (this.avatarCanvasComponent.sx / this.avatarCanvasComponent.sWidth) *
      ChangeAvatarComponent.SMALL_IMAGE_LENGTH
    }px`;
    this.previewSmallCanvas.style.top = `-${
      (this.avatarCanvasComponent.sy / this.avatarCanvasComponent.sHeight) *
      ChangeAvatarComponent.SMALL_IMAGE_LENGTH
    }px`;
  }

  private async uploadAvatar(): Promise<void> {
    this.uploadStatusText.style.display = "none";
    try {
      let blob = await this.avatarCanvasComponent.export();
      await this.serviceClient.send(
        newUploadAvatarServiceRequest({
          body: blob,
        })
      );
    } catch (e) {
      this.uploadStatusText.style.color = SCHEME.errorText;
      this.uploadStatusText.textContent = LOCALIZED_TEXT.uploadAvatarError;
      this.uploadStatusText.style.display = "block";
      console.error(e);
      return;
    }
    this.uploadStatusText.style.color = SCHEME.normalText;
    this.uploadStatusText.textContent = LOCALIZED_TEXT.uploadAvatarSuccess;
    this.uploadStatusText.style.display = "block";
  }

  public show(): void {
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
