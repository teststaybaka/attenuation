import { FillButton, OutlineButton } from "../../common/button";
import { newUploadAvatarServiceRequest } from "../../common/client_requests";
import { SCHEME } from "../../common/color_scheme";
import { LOCALIZED_TEXT } from "../../common/locales/localized_text";
import { WEB_SERVICE_CLIENT } from "../../common/web_service_client";
import { AvatarCanvas } from "./avatar_canvas";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export class ChangeAvatarTab {
  private static LARGE_IMAGE_LENGTH = 160;
  private static SMALL_IMAGE_LENGTH = 50;

  public body: HTMLDivElement;
  private loadErrorText: HTMLDivElement;
  private previewLargeCanvas: HTMLCanvasElement;
  private previewSmallCanvas: HTMLCanvasElement;
  private uploadStatusText: HTMLDivElement;
  private fileInput = E.input({ type: "file" });

  public constructor(
    private avatarCanvas: AvatarCanvas,
    private chooseFileButton: OutlineButton,
    private uploadButton: FillButton,
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
        style: `display: none; margin-top: 1rem; font-size: 1.4rem; color: ${SCHEME.error0};`,
      }),
      E.div(
        {
          class: "change-avatar-canvas-wrapper",
          style: `margin: 3rem 0; width: 46rem; height: 46rem;`,
        },
        avatarCanvas.body
      ),
      E.div(
        {
          class: "change-avatar-preview-label",
          style: `font-size: 1.4rem; color: ${SCHEME.neutral0};`,
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
              style: `position: relative; width: ${ChangeAvatarTab.LARGE_IMAGE_LENGTH}px; height: ${ChangeAvatarTab.LARGE_IMAGE_LENGTH}px; border-radius: ${ChangeAvatarTab.LARGE_IMAGE_LENGTH}px; border: .1rem solid ${SCHEME.neutral1}; overflow: hidden;`,
            },
            E.canvasRef(previewLargeCanvasRef, {
              class: "change-avatar-preview-large-canvas",
              style: `position: absolute;`,
            })
          ),
          E.div(
            {
              class: "change-avatar-preview-large-label",
              style: `font-size: 1.4rem; color: ${SCHEME.neutral0}; margin-top: 2rem;`,
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
              style: `position: relative; width: ${ChangeAvatarTab.SMALL_IMAGE_LENGTH}px; height: ${ChangeAvatarTab.SMALL_IMAGE_LENGTH}px; border-radius: ${ChangeAvatarTab.SMALL_IMAGE_LENGTH}px; border: .1rem solid ${SCHEME.neutral1}; overflow: hidden;`,
            },
            E.canvasRef(previewSmallCanvasRef, {
              class: "change-vatar-preview-small-canvas",
              style: `position: absolute;`,
            })
          ),
          E.div(
            {
              class: "change-avatar-preview-small-label",
              style: `font-size: 1.4rem; color: ${SCHEME.neutral0}; margin-top: 2rem;`,
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

    this.chooseFileButton.on("click", () => this.chooseFile());
    this.fileInput.addEventListener("input", () => this.load());
    this.avatarCanvas.on("change", () => this.preview());
    this.uploadButton.on("click", () => this.uploadAvatar());
    this.hide();
  }

  public static create(): ChangeAvatarTab {
    return new ChangeAvatarTab(
      AvatarCanvas.create(),
      OutlineButton.create(true, E.text(LOCALIZED_TEXT.chooseAvatarLabel)),
      FillButton.create(false, E.text(LOCALIZED_TEXT.uploadAvatarLabel)),
      WEB_SERVICE_CLIENT
    );
  }

  private chooseFile(): void {
    this.fileInput.click();
  }

  private async load(): Promise<void> {
    this.loadErrorText.style.display = "none";
    try {
      await this.avatarCanvas.load(this.fileInput.files[0]);
    } catch (e) {
      this.loadErrorText.textContent = LOCALIZED_TEXT.loadImageError;
      this.loadErrorText.style.display = "block";
      console.error(e);
      return;
    }

    this.previewLargeCanvas.width = this.avatarCanvas.canvas.width;
    this.previewLargeCanvas.height = this.avatarCanvas.canvas.height;
    this.previewLargeCanvas
      .getContext("2d")
      .drawImage(this.avatarCanvas.canvas, 0, 0);
    this.previewSmallCanvas.width = this.avatarCanvas.canvas.width;
    this.previewSmallCanvas.height = this.avatarCanvas.canvas.height;
    this.previewSmallCanvas
      .getContext("2d")
      .drawImage(this.avatarCanvas.canvas, 0, 0);
    this.uploadButton.enable();
  }

  public preview(): void {
    this.previewLargeCanvas.style.width = `${
      (this.avatarCanvas.canvas.width / this.avatarCanvas.sWidth) *
      ChangeAvatarTab.LARGE_IMAGE_LENGTH
    }px`;
    this.previewLargeCanvas.style.height = `${
      (this.avatarCanvas.canvas.height / this.avatarCanvas.sHeight) *
      ChangeAvatarTab.LARGE_IMAGE_LENGTH
    }px`;
    this.previewLargeCanvas.style.left = `-${
      (this.avatarCanvas.sx / this.avatarCanvas.sWidth) *
      ChangeAvatarTab.LARGE_IMAGE_LENGTH
    }px`;
    this.previewLargeCanvas.style.top = `-${
      (this.avatarCanvas.sy / this.avatarCanvas.sHeight) *
      ChangeAvatarTab.LARGE_IMAGE_LENGTH
    }px`;
    this.previewSmallCanvas.style.width = `${
      (this.avatarCanvas.canvas.width / this.avatarCanvas.sWidth) *
      ChangeAvatarTab.SMALL_IMAGE_LENGTH
    }px`;
    this.previewSmallCanvas.style.height = `${
      (this.avatarCanvas.canvas.height / this.avatarCanvas.sHeight) *
      ChangeAvatarTab.SMALL_IMAGE_LENGTH
    }px`;
    this.previewSmallCanvas.style.left = `-${
      (this.avatarCanvas.sx / this.avatarCanvas.sWidth) *
      ChangeAvatarTab.SMALL_IMAGE_LENGTH
    }px`;
    this.previewSmallCanvas.style.top = `-${
      (this.avatarCanvas.sy / this.avatarCanvas.sHeight) *
      ChangeAvatarTab.SMALL_IMAGE_LENGTH
    }px`;
  }

  private async uploadAvatar(): Promise<void> {
    this.uploadStatusText.style.display = "none";
    try {
      let blob = await this.avatarCanvas.export();
      await this.sendUploadAvatarRequest(blob);
    } catch (e) {
      this.uploadStatusText.style.color = SCHEME.error0;
      this.uploadStatusText.textContent = LOCALIZED_TEXT.uploadAvatarError;
      this.uploadStatusText.style.display = "block";
      console.error(e);
      return;
    }
    this.uploadStatusText.style.color = SCHEME.neutral0;
    this.uploadStatusText.textContent = LOCALIZED_TEXT.uploadAvatarSuccess;
    this.uploadStatusText.style.display = "block";
  }

  protected async sendUploadAvatarRequest(blob: Blob): Promise<void> {
    await this.serviceClient.send(
      newUploadAvatarServiceRequest({
        body: blob,
      })
    );
  }

  public show(): void {
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
