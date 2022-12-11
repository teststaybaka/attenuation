import EventEmitter = require("events");
import { SCHEME } from "../../../common/color_scheme";
import { createArrowIcon } from "../../../common/icons";
import { MenuItem } from "../../common/menu_item";
import { createBackMenuItem } from "../../common/menu_items";
import { ImageViewer } from "./image_viewer";
import { E } from "@selfage/element/factory";

export interface ImagesViewerPage {
  on(event: "load", listener: () => void): this;
}

export class ImagesViewerPage extends EventEmitter {
  public bodies = new Array<HTMLDivElement>();
  public menuBodies = new Array<HTMLDivElement>();
  public controllerBodies = new Array<HTMLDivElement>();
  private backButton: MenuItem;
  private downButton: HTMLDivElement;
  private upButton: HTMLDivElement;
  private imagesLoaded = 0;
  private imageViewers = new Array<ImageViewer>();

  public constructor(
    private imageUrls: Array<string>,
    private index: number,
    imageViewerFactoryFn: (imageUrl: string, display: boolean) => ImageViewer
  ) {
    super();
    this.backButton = createBackMenuItem();
    this.menuBodies.push(this.backButton.body);

    this.downButton = E.div(
      {
        class: "images-viewer-down-button",
        style: `width: 3rem; height: 3rem; rotate: -90deg;`,
      },
      createArrowIcon("currentColor")
    );
    this.upButton = E.div(
      {
        class: "images-viewer-up-button",
        style: `width: 3rem; height: 3rem; rotate: 90deg;`,
      },
      createArrowIcon("currentColor")
    );
    this.controllerBodies.push(this.downButton, this.upButton);

    for (let i = 0; i < this.imageUrls.length; i++) {
      let imageViewer = imageViewerFactoryFn(
        this.imageUrls[i],
        i === this.index
      );
      imageViewer.on("load", () => this.checkLoaded());
      this.imageViewers.push(imageViewer);
      this.bodies.push(imageViewer.body);
      this.controllerBodies.push(...imageViewer.controllerBodies);
    }
    this.setButtonState();

    this.downButton.addEventListener("click", () => this.showNext());
    this.upButton.addEventListener("click", () => this.showPrev());
  }

  private checkLoaded(): void {
    this.imagesLoaded++;
    if (this.imagesLoaded >= this.imageUrls.length) {
      this.emit("load");
    }
  }

  private showNext(): void {
    if (this.index >= this.imageViewers.length - 1) {
      return;
    }
    this.imageViewers[this.index].hide();
    this.index++;
    this.imageViewers[this.index].show();
    this.setButtonState();
  }

  private showPrev(): void {
    if (this.index <= 0) {
      return;
    }
    this.imageViewers[this.index].hide();
    this.index--;
    this.imageViewers[this.index].show();
    this.setButtonState();
  }

  private setButtonState(): void {
    if (this.index >= this.imageViewers.length - 1) {
      this.fadeButton(this.downButton);
    } else {
      this.restoreButton(this.downButton);
    }
    if (this.index <= 0) {
      this.fadeButton(this.upButton);
    } else {
      this.restoreButton(this.upButton);
    }
  }

  private restoreButton(button: HTMLDivElement): void {
    button.style.color = SCHEME.neutral1;
    button.style.cursor = "pointer";
  }

  private fadeButton(button: HTMLDivElement): void {
    button.style.color = SCHEME.neutral3;
    button.style.cursor = "not-allowed";
  }
}
