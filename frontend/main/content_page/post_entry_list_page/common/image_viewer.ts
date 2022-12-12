import EventEmitter = require("events");
import { SCHEME } from "../../../common/color_scheme";
import {
  createExpandIcon,
  createMinusIcon,
  createPlusIcon,
} from "../../../common/icons";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface ImageViewer {
  on(event: "load", listener: () => void): this;
}

export class ImageViewer extends EventEmitter {
  private static BUTTON_STYLE = `width: 3rem; height: 3rem;`;

  public body: HTMLDivElement;
  public controllerBody: HTMLDivElement;
  private zoomInButton: HTMLDivElement;
  private zommOutButton: HTMLDivElement;
  private zommFitButton: HTMLDivElement;
  private image: HTMLImageElement;

  public constructor(imageUrl: string, display: boolean) {
    super();
    let zoomInButtonRef = new Ref<HTMLDivElement>();
    let zoomOutButtonRef = new Ref<HTMLDivElement>();
    let zoomFitButtonRef = new Ref<HTMLDivElement>();
    this.controllerBody = E.div(
      {
        class: "image-viewer-controllers",
        style: `flex-flow: column nowrap; gap: .3rem;`,
      },
      E.divRef(
        zoomInButtonRef,
        {
          class: "image-viewer-zoom-in-button",
          style: ImageViewer.BUTTON_STYLE,
        },
        createPlusIcon(SCHEME.neutral1)
      ),
      E.divRef(
        zoomOutButtonRef,
        {
          class: "image-viewer-zoom-out-button",
          style: ImageViewer.BUTTON_STYLE,
        },
        createMinusIcon(SCHEME.neutral1)
      ),
      E.divRef(
        zoomFitButtonRef,
        {
          class: "image-viewer-zoom-fit-button",
          style: ImageViewer.BUTTON_STYLE,
        },
        createExpandIcon(SCHEME.neutral1)
      )
    );
    this.zoomInButton = zoomInButtonRef.val;
    this.zommOutButton = zoomOutButtonRef.val;
    this.zommFitButton = zoomFitButtonRef.val;

    let imageRef = new Ref<HTMLImageElement>();
    this.body = E.div(
      {
        class: "image-viewer-image-scroller",
        style: `flex-flow: column nowrap; min-width: 100vw; min-height: 100vh;`,
      },
      E.imageRef(imageRef, {
        class: "image-viewer-image",
        style: `flex: 0 0 auto; margin: auto;`,
      })
    );
    this.image = imageRef.val;
    if (display) {
      this.show();
    } else {
      this.hide();
    }

    this.zoomInButton.addEventListener("click", () => this.zoomInImage());
    this.zommOutButton.addEventListener("click", () => this.zoomOutImage());
    this.zommFitButton.addEventListener("click", () => this.fitImage());
    this.image.onload = () => this.load();
    this.image.src = imageUrl;
  }

  public static create(imageUrl: string, display: boolean): ImageViewer {
    return new ImageViewer(imageUrl, display);
  }

  private zoomInImage(): void {
    this.zoomImage(1.2);
  }

  private zoomOutImage(): void {
    this.zoomImage(0.8);
  }

  private zoomImage(percentage: number): void {
    let clientWidth = this.image.clientWidth;
    let newClientWidth = clientWidth * percentage;
    let newScrollX = window.scrollX + newClientWidth / 2 - clientWidth / 2;
    let clientHeight = this.image.clientHeight;
    let newClientHeight = clientHeight * percentage;
    let newScrollY = window.scrollY + newClientHeight / 2 - clientHeight / 2;
    this.image.style.width = `${newClientWidth}px`;
    this.image.clientWidth; // Force flush
    window.scrollTo(newScrollX, newScrollY);
  }

  private fitImage(): void {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    if (
      this.image.naturalWidth / this.image.naturalHeight >
      viewportWidth / viewportHeight
    ) {
      this.image.style.width = `${viewportWidth}px`;
    } else {
      this.image.style.width = `${
        (this.image.naturalWidth / this.image.naturalHeight) * viewportHeight
      }px`;
    }
  }

  private load(): void {
    this.fitImage();
    this.emit("load");
  }

  public show(): void {
    this.body.style.display = "flex";
    this.controllerBody.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
    this.controllerBody.style.display = "none";
  }

  public delete(): void {
    this.body.remove();
    this.controllerBody.remove();
  }
}
