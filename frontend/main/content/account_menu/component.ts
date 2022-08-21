import EventEmitter = require("events");
import { MenuContainer } from "../common/menu_container";
import { MenuItemComponent } from "../common/menu_item/component";
import {
  createHomeMenuItemComponent,
  createRefreshMenuItemComponent,
} from "../common/menu_items";
import { MENU_CONTAINER_STYLE } from "../common/styles";
import { E } from "@selfage/element/factory";

export interface AccountMenuComponent {
  on(event: "home", listener: () => void): this;
  on(event: "refresh", listener: () => void): this;
}

export class AccountMenuComponent
  extends EventEmitter
  implements MenuContainer
{
  public static HEIGHT = MenuItemComponent.MENU_ITEM_TOTAL_HEIGHT * 2;

  public body: HTMLDivElement;

  public constructor(
    private homeMenuIconComponent: MenuItemComponent,
    private freshMenuItemComponent: MenuItemComponent
  ) {
    super();
    this.body = E.div(
      {
        class: "account-menu",
        style: MENU_CONTAINER_STYLE,
      },
      homeMenuIconComponent.body,
      freshMenuItemComponent.body
    );
  }

  public static create(): AccountMenuComponent {
    return new AccountMenuComponent(
      createHomeMenuItemComponent(),
      createRefreshMenuItemComponent()
    ).init();
  }

  public init(): this {
    this.homeMenuIconComponent.on("action", () => this.emit("home"));
    this.freshMenuItemComponent.on("action", () => this.emit("fresh"));
    this.collapse();
    return this;
  }

  public expand(): void {
    this.body.style.height = `${AccountMenuComponent.HEIGHT}rem`;
  }

  public collapse(): void {
    this.body.style.height = "0";
  }
}
