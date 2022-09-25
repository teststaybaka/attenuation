import { MenuItem } from "./menu_item";
import { E } from "@selfage/element/factory";

export class MenuContainer {
  public body: HTMLDivElement;
  private height: number;

  public constructor(...menuItems: Array<MenuItem>) {
    this.body = E.div(
      {
        class: "account-menu",
        style: `display: flex; flex-flow: column nowrap; transition: height .3s linear; overflow-y: hidden;`,
      },
      ...menuItems.map((menuItem) => menuItem.body)
    );
    this.height = MenuItem.MENU_ITEM_TOTAL_HEIGHT * menuItems.length;
    this.collapse();
  }

  public static create(...menuItems: Array<MenuItem>): MenuContainer {
    return new MenuContainer(...menuItems);
  }

  public expand(): void {
    this.body.style.height = `${this.height}rem`;
  }

  public collapse(): void {
    this.body.style.height = "0";
  }
}
