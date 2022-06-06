import EventEmitter = require("events");
import { MenuContainer } from "../common/menu_container";
import { MenuItemComponent } from "../common/menu_item/component";
import {
  createAccountMenuItemComponent,
  createRefershPostsMenuItemComponent,
  createWritePostMenuItemComponent,
} from "../common/menu_items";
import { MENU_CONTAINER_STYLE } from "../common/styles";
import { E } from "@selfage/element/factory";

export interface HomeMenuComponent {
  on(event: "write", listener: () => void): this;
  on(event: "refresh", listener: () => void): this;
  on(event: "account", listener: () => void): this;
}

export class HomeMenuComponent extends EventEmitter implements MenuContainer {
  private static HEIGHT = MenuItemComponent.MENU_ITEM_TOTAL_HEIGHT * 3;

  public body: HTMLDivElement;

  public constructor(
    private writeMenuItemComponent: MenuItemComponent,
    private freshPostsMenuItemComponent: MenuItemComponent,
    private accountMenuIconComponent: MenuItemComponent
  ) {
    super();
    this.body = E.div(
      {
        class: "home-menu",
        style: MENU_CONTAINER_STYLE,
      },
      writeMenuItemComponent.body,
      freshPostsMenuItemComponent.body,
      accountMenuIconComponent.body
    );
  }

  public static create(): HomeMenuComponent {
    return new HomeMenuComponent(
      createWritePostMenuItemComponent(),
      createRefershPostsMenuItemComponent(),
      createAccountMenuItemComponent()
    ).init();
  }

  public init(): this {
    this.writeMenuItemComponent.on("action", () => this.emit("write"));
    this.freshPostsMenuItemComponent.on("action", () => this.emit("fresh"));
    this.accountMenuIconComponent.on("action", () => this.emit("account"));
    this.collapse();
    return this;
  }

  public expand(): void {
    this.body.style.height = `${HomeMenuComponent.HEIGHT}rem`;
  }

  public collapse(): void {
    this.body.style.height = "0";
  }
}
