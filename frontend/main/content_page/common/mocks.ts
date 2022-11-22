import { MenuItem } from "./menu_item";

export class MenuItemMock extends MenuItem {
  public click(): void {
    this.body.click();
  }
  public hover(): void {
    this.body.dispatchEvent(new MouseEvent("mouseover"));
  }
  public leave(): void {
    this.body.dispatchEvent(new MouseEvent("mouseleave"));
  }
}
