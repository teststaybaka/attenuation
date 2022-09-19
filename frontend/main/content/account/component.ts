import EventEmitter = require("events");
import { SCHEME } from "../../common/color_scheme";
import { MenuContainer } from "../common/menu_container/component";
import { MenuItem } from "../common/menu_item/component";
import { createBackMenuItem, createHomeMenuItem } from "../common/menu_items";
import { AccountBasicComponent } from "./account_basic/component";
import { ChangeAvatarComponent } from "./change_avatar/component";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface AccountComponent {
  on(event: "home", listener: () => void): this;
}

export class AccountComponent extends EventEmitter {
  public body: HTMLDivElement;
  public menuBody: HTMLDivElement;
  public backMenuBody: HTMLDivElement;
  private card: HTMLDivElement;
  private accountMenuContainer: MenuContainer;
  private backMenuContainer: MenuContainer;

  public constructor(
    private accountBasic: AccountBasicComponent,
    private changeAvatar: ChangeAvatarComponent,
    private homeMenuItem: MenuItem,
    private backMenuItem: MenuItem
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
    this.accountMenuContainer = MenuContainer.create(homeMenuItem);
    this.backMenuContainer = MenuContainer.create(backMenuItem);
    this.menuBody = this.accountMenuContainer.body;
    this.backMenuBody = this.backMenuContainer.body;
  }

  public static create(): AccountComponent {
    return new AccountComponent(
      AccountBasicComponent.create(),
      ChangeAvatarComponent.create(),
      createHomeMenuItem(),
      createBackMenuItem()
    ).init();
  }

  public init(): this {
    this.hide();

    let observer = new ResizeObserver((entries) => {
      this.resize(entries[0]);
    });
    observer.observe(this.body);

    this.homeMenuItem.on("action", () => this.emit("home"));
    this.backMenuItem.on("action", () => this.showAccountBasic());
    this.accountBasic.on("changeAvatar", () => this.showChangeAvatar());
    return this;
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
    this.accountMenuContainer.expand();
    this.body.style.display = "flex";
    await this.showAccountBasic();
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
