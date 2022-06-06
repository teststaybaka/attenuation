import EventEmitter = require("events");
import { SCHEME } from "../../../common/color_scheme";
import { E } from "@selfage/element/factory";

export interface MenuItemComponent {
  on(event: "action", listener: () => void): this;
}

export class MenuItemComponent extends EventEmitter {
  public static MENU_ITEM_HEIGHT = 5; // rem
  public static MENU_ITEM_MARGIN = 0.8; // rem
  public static MENU_ITEM_TOTAL_HEIGHT =
    MenuItemComponent.MENU_ITEM_HEIGHT + MenuItemComponent.MENU_ITEM_MARGIN;

  public body: HTMLDivElement;

  public constructor(svg: SVGSVGElement, label: string) {
    super();
    this.body = E.div(
      {
        class: "menu-item",
        style: `display: flex; flex-flow: row nowrap; align-items: center; height: ${MenuItemComponent.MENU_ITEM_HEIGHT}rem; margin-bottom: ${MenuItemComponent.MENU_ITEM_MARGIN}rem; border-radius: ${MenuItemComponent.MENU_ITEM_HEIGHT}rem; transition: background-color .3s linear;`,
      },
      svg,
      E.div(
        {
          class: "menu-item-label",
          style: `margin-left: .5rem; font-size: 1.6rem; line-height: ${MenuItemComponent.MENU_ITEM_HEIGHT}rem; color: ${SCHEME.menuText};`,
        },
        E.text(label)
      )
    );
  }

  public static create(svg: SVGSVGElement, label: string): MenuItemComponent {
    return new MenuItemComponent(svg, label).init();
  }

  public init(): this {
    this.body.addEventListener("mouseover", () => this.highlight());
    this.body.addEventListener("mouseleave", () => this.lowlight());
    this.lowlight();

    this.body.addEventListener("click", () => this.emit("action"));
    return this;
  }

  private highlight(): void {
    this.body.style.backgroundColor = SCHEME.menuHighlightBackground;
  }

  private lowlight(): void {
    this.body.style.backgroundColor = "initial";
  }
}
