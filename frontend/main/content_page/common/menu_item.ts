import EventEmitter = require("events");
import { SCHEME } from "../../common/color_scheme";
import { E } from "@selfage/element/factory";

export interface MenuItem {
  on(event: "action", listener: () => void): this;
}

export class MenuItem extends EventEmitter {
  public static MENU_ITEM_HEIGHT = 5; // rem
  public static MENU_ITEM_MARGIN = 0.8; // rem
  public static MENU_ITEM_TOTAL_HEIGHT =
    MenuItem.MENU_ITEM_HEIGHT + MenuItem.MENU_ITEM_MARGIN;

  public body: HTMLDivElement;

  public constructor(svg: SVGSVGElement, label: string) {
    super();
    this.body = E.div(
      {
        class: "menu-item",
        style: `display: flex; flex-flow: row nowrap; justify-content: flex-start; align-items: center; height: ${MenuItem.MENU_ITEM_HEIGHT}rem; margin-bottom: ${MenuItem.MENU_ITEM_MARGIN}rem; border-radius: ${MenuItem.MENU_ITEM_HEIGHT}rem; transition: width .3s linear; overflow: hidden;`,
      },
      E.div(
        {
          class: "menu-item-icon",
          style: `flex: 0 0 auto; height: 100%;`,
        },
        svg
      ),
      E.div(
        {
          class: "menu-item-label",
          style: `flex: 0 0 auto; margin-left: .5rem; font-size: 1.6rem; line-height: ${MenuItem.MENU_ITEM_HEIGHT}rem; color: ${SCHEME.neutral0};`,
        },
        E.text(label)
      )
    );

    this.body.addEventListener("mouseover", () => this.expand());
    this.body.addEventListener("mouseleave", () => this.shrink());
    this.body.addEventListener("click", () => this.emit("action"));
    this.shrink();
  }

  public static create(svg: SVGSVGElement, label: string): MenuItem {
    return new MenuItem(svg, label);
  }

  private expand(): void {
    this.body.style.width = `${this.body.scrollWidth}px`;
  }

  private shrink(): void {
    this.body.style.width = `${MenuItem.MENU_ITEM_HEIGHT}rem`;
  }
}
