import EventEmitter = require("events");
import { SCHEME } from "../../common/color_scheme";
import { E } from "@selfage/element/factory";

export interface MenuItem {
  on(event: "transitionEnded", listener: () => void): this;
  on(event: "action", listener: () => void): this;
}

export class MenuItem extends EventEmitter {
  public static MENU_ITEM_LENGTH = 5; // rem

  public body: HTMLDivElement;

  public constructor(
    svg: SVGSVGElement,
    padding: string,
    label: string,
    showed: boolean
  ) {
    super();
    this.body = E.div(
      {
        class: "menu-item",
        style: `display: flex; flex-flow: row nowrap; align-items: center; height: ${MenuItem.MENU_ITEM_LENGTH}rem; border-radius: ${MenuItem.MENU_ITEM_LENGTH}rem; background-color: ${SCHEME.neutral4}; transition: width .3s .5s linear; overflow: hidden; cursor: pointer;`,
      },
      E.div(
        {
          class: "menu-item-icon",
          style: `height: 100%; padding: ${padding}; box-sizing: border-box;`,
        },
        svg
      ),
      E.div(
        {
          class: "menu-item-label",
          style: `margin: 0 1rem 0 .5rem; font-size: 1.6rem; line-height: ${MenuItem.MENU_ITEM_LENGTH}rem; color: ${SCHEME.neutral0};`,
        },
        E.text(label)
      )
    );
    this.collapse();
    if (showed) {
      this.show();
    } else {
      this.hide();
    }

    this.body.addEventListener("transitionend", () =>
      this.emit("transitionEnded")
    );
    this.body.addEventListener("mouseover", () => this.expand());
    this.body.addEventListener("mouseleave", () => this.collapse());
    this.body.addEventListener("click", () => this.emit("action"));
  }

  public static create(
    svg: SVGSVGElement,
    padding: string,
    label: string,
    showed: boolean
  ): MenuItem {
    return new MenuItem(svg, padding, label, showed);
  }

  private expand(): void {
    this.body.style.width = `${this.body.scrollWidth}px`;
  }

  private collapse(): void {
    this.body.style.width = `${MenuItem.MENU_ITEM_LENGTH}rem`;
  }

  public show(): void {
    this.body.style.display = `flex`;
  }

  public hide(): void {
    this.body.style.display = `none`;
  }

  public remove(): void {
    this.body.remove();
  }

  public click(): void {
    this.body.click();
  }
}
