import EventEmitter = require("events");
import { SCHEME } from "../../common/color_scheme";
import { MenuItem } from "../menu_item/container";
import {
  createAccountMenuItem,
  createHomeMenuItem,
} from "../menu_item/factory";
import { AccountBasicTab } from "./account_basic_tab";
import { ChangeAvatarTab } from "./change_avatar_tab";
import { E } from "@selfage/element/factory";

export interface AccountPage {
  on(event: "home", listener: () => void): this;
}

export class AccountPage extends EventEmitter {
  public body: HTMLDivElement;
  public menuBodies = new Array<HTMLDivElement>();
  // Visible for testing
  public homeMenuItem: MenuItem;
  public accountMenuItem: MenuItem;

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

    this.homeMenuItem = createHomeMenuItem(false);
    this.accountMenuItem = createAccountMenuItem(false);
    this.menuBodies.push(
      this.changeAvatar.menuBody,
      this.homeMenuItem.body,
      this.accountMenuItem.body
    );

    this.hide();
    this.homeMenuItem.on("action", () => this.emit("home"));
    this.accountMenuItem.on("action", () => this.showAccountBasic());
    this.accountBasic.on("changeAvatar", () => this.showChangeAvatar());
    this.changeAvatar.on("back", () => this.showAccountBasic());
  }

  public static create(): AccountPage {
    return new AccountPage(AccountBasicTab.create(), ChangeAvatarTab.create());
  }

  private showChangeAvatar(): void {
    this.accountBasic.hide();
    this.changeAvatar.show();
  }

  private async showAccountBasic(): Promise<void> {
    this.changeAvatar.hide();
    await this.accountBasic.show();
  }

  public async show(): Promise<void> {
    this.homeMenuItem.show();
    this.accountMenuItem.show();
    this.body.style.display = "flex";
    await this.showAccountBasic();
  }

  public hide(): void {
    this.homeMenuItem.hide();
    this.accountMenuItem.hide();
    this.body.style.display = "none";
  }
}
