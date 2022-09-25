import EventEmitter = require("events");
import { SCHEME } from "../../common/color_scheme";
import { MenuContainer } from "../common/menu_container";
import { MenuItem } from "../common/menu_item";
import { createBackMenuItem, createHomeMenuItem } from "../common/menu_items";
import { AccountBasicTab } from "./account_basic_tab";
import { ChangeAvatarTab } from "./change_avatar_tab";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface AccountPage {
  on(event: "home", listener: () => void): this;
}

export class AccountPage extends EventEmitter {
  public body: HTMLDivElement;
  public menuBodies = new Array<HTMLDivElement>();
  private card: HTMLDivElement;
  private homeMenuItem: MenuItem;
  private menuContainer: MenuContainer;
  private backMenuItem: MenuItem;
  private backMenuContainer: MenuContainer;

  public constructor(
    private accountBasic: AccountBasicTab,
    private changeAvatar: ChangeAvatarTab
  ) {
    super();
    let cardRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "account",
        style: `flex-flow: row nowrap; justify-content: center; width: 100%;`,
      },
      E.divRef(
        cardRef,
        {
          class: "account-card",
          style: `background-color: ${SCHEME.accountCardBackground};`,
        },
        accountBasic.body,
        changeAvatar.body
      )
    );
    this.card = cardRef.val;
    this.homeMenuItem = createHomeMenuItem();
    this.menuContainer = MenuContainer.create(this.homeMenuItem);
    this.backMenuItem = createBackMenuItem();
    this.backMenuContainer = MenuContainer.create(this.backMenuItem);
    this.menuBodies.push(this.menuContainer.body, this.backMenuContainer.body);

    this.homeMenuItem.on("action", () => this.emit("home"));
    this.backMenuItem.on("action", () => this.showAccountBasic());
    this.accountBasic.on("changeAvatar", () => this.showChangeAvatar());
    let observer = new ResizeObserver((entries) => {
      this.resize(entries[0]);
    });
    observer.observe(this.body);
    this.hide();
  }

  public static create(): AccountPage {
    return new AccountPage(AccountBasicTab.create(), ChangeAvatarTab.create());
  }

  private resize(entry: ResizeObserverEntry): void {
    if (entry.contentRect.width > 1000) {
      this.card.style.flexBasis = `1000px`;
    } else {
      this.card.style.flexBasis = "100%";
    }
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
