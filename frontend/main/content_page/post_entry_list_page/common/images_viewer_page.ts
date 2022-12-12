import EventEmitter = require("events");
import { SCHEME } from "../../../common/color_scheme";
import { createArrowIcon } from "../../../common/icons";
import { MenuContainer } from "../../common/menu_container";
import { MenuItem } from "../../common/menu_item";
import { createBackMenuItem } from "../../common/menu_items";
import { ImageViewer } from "./image_viewer";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface ImagesViewerPage {
  on(event: "back", listener: () => void): this;
}

export class ImagesViewerPage extends EventEmitter {
  public body: HTMLDivElement;
  public menuBody: HTMLDivElement;
  public controllerBodies = new Array<HTMLDivElement>();
  private menuContainer: MenuContainer;
  private navigationControllerContainer: HTMLDivElement;
  private upButton: HTMLDivElement;
  private downButton: HTMLDivElement;
  private zoomControllerContainer: HTMLDivElement;
  private index: number;
  private imageViewers = new Array<ImageViewer>();

  public constructor(
    private backButton: MenuItem,
    private imageViewerFactoryFn: (
      imageUrl: string,
      display: boolean
    ) => ImageViewer
  ) {
    super();
    this.menuContainer = MenuContainer.create(this.backButton);
    this.menuBody = this.menuContainer.body;

    this.zoomControllerContainer = E.div({
      class: "images-viewer-zoom-controllers",
    });

    let upButtonRef = new Ref<HTMLDivElement>();
    let downButtonRef = new Ref<HTMLDivElement>();
    this.navigationControllerContainer = E.div(
      {
        class: "images-viewer-navigation-controllers",
        style: `flex-flow: column nowrap; gap: .3rem;`,
      },
      E.divRef(
        upButtonRef,
        {
          class: "images-viewer-up-button",
          style: `width: 3rem; height: 3rem; rotate: 90deg;`,
        },
        createArrowIcon("currentColor")
      ),
      E.divRef(
        downButtonRef,
        {
          class: "images-viewer-down-button",
          style: `width: 3rem; height: 3rem; rotate: -90deg;`,
        },
        createArrowIcon("currentColor")
      )
    );
    this.upButton = upButtonRef.val;
    this.downButton = downButtonRef.val;
    this.controllerBodies.push(
      this.zoomControllerContainer,
      this.navigationControllerContainer
    );

    this.body = E.div({
      class: "images-viewer",
    });

    this.hide();
    this.backButton.on("action", () => this.emit("back"));
    this.downButton.addEventListener("click", () => this.showNext());
    this.upButton.addEventListener("click", () => this.showPrev());
  }

  public static create(): ImagesViewerPage {
    return new ImagesViewerPage(createBackMenuItem(), ImageViewer.create);
  }

  public async show(
    imageUrls: Array<string>,
    initialIndex: number
  ): Promise<void> {
    for (let imageViewer of this.imageViewers) {
      imageViewer.delete();
    }
    this.imageViewers = new Array<ImageViewer>();
    this.body.style.display = "block";
    this.menuContainer.expand();

    this.index = initialIndex;
    await new Promise<void>((resolve) => {
      let imagesLoaded = 0;
      for (let i = 0; i < imageUrls.length; i++) {
        let imageViewer = this.imageViewerFactoryFn(
          imageUrls[i],
          i === initialIndex
        );
        imageViewer.on("load", () => {
          imagesLoaded++;
          if (imagesLoaded >= imageUrls.length) {
            resolve();
          }
        });
        this.imageViewers.push(imageViewer);
        this.body.append(imageViewer.body);
        this.zoomControllerContainer.append(
          imageViewer.controllerBody
        );
      }
      this.setButtonState();
    });
    this.zoomControllerContainer.style.display = "block";
    this.navigationControllerContainer.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
    this.menuContainer.collapse();
    this.zoomControllerContainer.style.display = "none";
    this.navigationControllerContainer.style.display = "none";
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
      this.fadeButton(this.upButton);
    } else {
      this.restoreButton(this.upButton);
    }
    if (this.index >= this.imageViewers.length - 1) {
      this.fadeButton(this.downButton);
    } else {
      this.restoreButton(this.downButton);
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
