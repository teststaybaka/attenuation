import EventEmitter = require("events");
import { SCHEME } from "../../../common/color_scheme";
import { IconButton, TooltipPosition } from "../../../common/icon_button";
import { createArrowIcon } from "../../../common/icons";
import { LOCALIZED_TEXT } from "../../../common/locales/localized_text";
import { MenuItem } from "../../menu_item/container";
import { createBackMenuItem } from "../../menu_item/factory";
import { ImageViewer } from "./image_viewer";

export interface ImagesViewerPage {
  on(event: "back", listener: () => void): this;
  on(event: "bodies", listener: (bodies: Array<HTMLDivElement>) => void): this;
  on(
    event: "controllerBodies",
    listener: (controllerBodies: Array<HTMLDivElement>) => void
  ): this;
}

export class ImagesViewerPage extends EventEmitter {
  public menuBody: HTMLDivElement;
  public controllerBodies: Array<HTMLDivElement>;
  // Visible for testing
  public backMenuItem: MenuItem;
  public upButton: IconButton;
  public downButton: IconButton;

  private index: number;
  private imageViewers = new Array<ImageViewer>();

  public constructor() {
    super();
    this.backMenuItem = createBackMenuItem(false);
    this.menuBody = this.backMenuItem.body;

    this.upButton = IconButton.create(
      `width: 3rem; height: 3rem; padding: .7rem; box-sizing: border-box; rotate: 90deg;`,
      createArrowIcon("currentColor"),
      TooltipPosition.LEFT,
      LOCALIZED_TEXT.prevImageLabel,
      false
    );
    this.downButton = IconButton.create(
      `width: 3rem; height: 3rem; padding: .7rem; box-sizing: border-box; rotate: -90deg;`,
      createArrowIcon("currentColor"),
      TooltipPosition.LEFT,
      LOCALIZED_TEXT.nextImageLabel,
      false
    );
    this.controllerBodies = [this.downButton.body, this.upButton.body];

    this.hide();
    this.backMenuItem.on("action", () => this.emit("back"));
    this.downButton.on("action", () => this.showNext());
    this.upButton.on("action", () => this.showPrev());
  }

  public static create(): ImagesViewerPage {
    return new ImagesViewerPage();
  }

  public async show(
    imageUrls: Array<string>,
    initialIndex: number
  ): Promise<void> {
    this.backMenuItem.show();
    this.upButton.show();
    this.downButton.show();

    this.index = initialIndex;
    await new Promise<void>((resolve) => {
      let imagesLoaded = 0;
      for (let i = 0; i < imageUrls.length; i++) {
        let imageViewer = ImageViewer.create(imageUrls[i], i === initialIndex);
        imageViewer.once("loaded", () => {
          imagesLoaded++;
          if (imagesLoaded >= imageUrls.length) {
            resolve();
          }
        });
        this.imageViewers.push(imageViewer);
        this.emit("bodies", [imageViewer.body]);
        this.emit("controllerBodies", imageViewer.controllerBodies);
      }
      this.setButtonState();
    });
  }

  public hide(): void {
    this.backMenuItem.hide();
    this.upButton.hide();
    this.downButton.hide();
    for (let imageViewer of this.imageViewers) {
      imageViewer.remove();
    }
    this.imageViewers = new Array<ImageViewer>();
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
    if (this.index <= 0) {
      this.fadeButton(this.upButton.body);
    } else {
      this.restoreButton(this.upButton.body);
    }
    if (this.index >= this.imageViewers.length - 1) {
      this.fadeButton(this.downButton.body);
    } else {
      this.restoreButton(this.downButton.body);
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
