import EventEmitter = require("events");
import { SCHEME } from "../../common/color_scheme";
import { MenuContainer } from "../common/menu_container";
import { MenuItem } from "../common/menu_item";
import { createBackMenuItem, createHomeMenuItem } from "../common/menu_items";
import { AccountBasicTab } from "./account_basic_tab";
import { ChangeAvatarTab } from "./change_avatar_tab";
import { E } from "@selfage/element/factory";

export interface AccountPage {
  on(event: "home", listener: () => void): this;
}

export class AccountPage extends EventEmitter {
  public body: HTMLDivElement;
  public menuBodies = new Array<HTMLDivElement>();
  private homeMenuItem: MenuItem;
  private menuContainer: MenuContainer;
  private backMenuItem: MenuItem;
  private backMenuContainer: MenuContainer;

  public constructor(
    private accountBasic: AccountBasicTab,
    private changeAvatar: ChangeAvatarTab
  ) {
    super();
    this.body = E.div(
      {
        class: "account",
        style: `flex-flow: row nowrap; justify-content: center; width: 100vw;`,
      },
      E.div(
        {
          class: "account-card",
          style: `background-color: ${SCHEME.neutral4}; width: 100%; max-width: 100rem;`,
        },
        accountBasic.body,
        changeAvatar.body
      )
    );
    this.homeMenuItem = createHomeMenuItem();
    this.menuContainer = MenuContainer.create(this.homeMenuItem);
    this.backMenuItem = createBackMenuItem();
    this.backMenuContainer = MenuContainer.create(this.backMenuItem);
    this.menuBodies.push(this.menuContainer.body, this.backMenuContainer.body);
    this.hide();

    this.homeMenuItem.on("action", () => this.emit("home"));
    this.backMenuItem.on("action", () => this.showAccountBasic());
    this.accountBasic.on("changeAvatar", () => this.showChangeAvatar());
  }

  public static create(): AccountPage {
    return new AccountPage(AccountBasicTab.create(), ChangeAvatarTab.create());
  }

  private showChangeAvatar(): void {
    this.backMenuContainer.expand();
    this.accountBasic.hide();
    this.changeAvatar.show();
  }

  private async showAccountBasic(): Promise<void> {
    this.backMenuContainer.collapse();
    this.changeAvatar.hide();
    await this.accountBasic.show();
  }

  public async show(): Promise<void> {
    this.menuContainer.expand();
    this.body.style.display = "flex";
    await this.showAccountBasic();
  }

  public hide(): void {
    this.menuContainer.collapse();
    this.backMenuContainer.collapse();
    this.body.style.display = "none";
  }
}
