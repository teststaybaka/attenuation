import EventEmitter = require("events");
import { SCHEME } from "../common/color_scheme";
import { AccountComponent } from "./account/account_basic/component";
import { AccountMenuComponent } from "./account/account_menu/component";
import { MenuContainer } from "./common/menu_container";
import { HomeMenuComponent } from "./home_menu/component";
import { PostEntryListComponent } from "./post_entry_list/component";
import { ContentPage, ContentState } from "./state";
import { E } from "@selfage/element/factory";
import { LazyInstance } from "@selfage/once/lazy_instance";
import { Ref } from "@selfage/ref";
import { TabsSwitcher } from "@selfage/tabs";

export interface ContentComponent {
  on(event: "signOut", listener: () => void): this;
}

export class ContentComponent extends EventEmitter {
  public body: HTMLDivElement;
  private logo: HTMLDivElement;
  private lazyAccountComponent: LazyInstance<AccountComponent>;
  private lazyPostEntryListComponent: LazyInstance<PostEntryListComponent>;
  private menuContainer: MenuContainer;
  private pageContainer: HTMLDivElement;
  private pageSwitcher = TabsSwitcher.create();

  public constructor(
    private homeMenuComponent: HomeMenuComponent,
    private accountMenuComponent: AccountMenuComponent,
    private accountComponentFactoryFn: () => AccountComponent,
    private postEntryListComponentFactoryFn: () => PostEntryListComponent,
    private state: ContentState
  ) {
    super();
    let logoRef = new Ref<HTMLDivElement>();
    let pageContainerRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "content",
        style: `flex-flow: row nowrap; width: 100vw; background-color: ${SCHEME.bodyBackground};`,
      },
      E.div(
        {
          class: "content-left-bar",
          style: `flex: 0 0 5rem;`,
        },
        E.div(
          {
            class: "menu",
            style: `position: relative;`,
          },
          E.divRef(
            logoRef,
            {
              class: "menu-logo",
              style: `width: 5rem; height: 5rem; border-radius: 5rem; transition: background-color .3s linear;`,
            },
            E.svg(
              {
                class: "menu-logo-svg",
                style: `height: 100%;`,
                viewBox: "-10 -10 220 220",
              },
              E.path({
                fill: SCHEME.logoOrange,
                d: `M 111.6 20.8 A 30 30 0 0 0 162.7 50.3 A 80 80 0 0 1 174.3 70.5 A 30 30 0 0 0 174.3 129.5 A 80 80 0 0 1 162.7 149.7 A 30 30 0 0 0 111.6 179.2 A 80 80 0 0 1 88.4 179.2 A 30 30 0 0 0 37.3 149.7 A 80 80 0 0 1 25.7 129.5 A 30 30 0 0 0 25.7 70.5 A 80 80 0 0 1 37.3 50.3 A 30 30 0 0 0 88.4 20.8 A 80 80 0 0 1 111.6 20.801 z  M 70 100 A 30 30 0 1 0 70 99.9 z`,
              }),
              E.path({
                fill: SCHEME.logoBlue,
                d: `M 80 100 A 20 20 0 1 1 80 100.01 z  M 160 100 A 20 20 0 1 1 160 100.01 z  M 120 169.3 A 20 20 0 1 1 120 169.31 z  M 40 169.3 A 20 20 0 1 1 40 169.31 z  M 0 100 A 20 20 0 1 1 0 100.01 z  M 40 30.7 A 20 20 0 1 1 40 30.71 z`,
              })
            )
          ),
          homeMenuComponent.body,
          accountMenuComponent.body
        )
      ),
      E.divRef(pageContainerRef, {
        class: "main-content-right-container",
        style: `flex: 1 0 0;`,
      })
    );
    this.logo = logoRef.val;
    this.pageContainer = pageContainerRef.val;
  }

  public static create(state: ContentState): ContentComponent {
    return new ContentComponent(
      HomeMenuComponent.create(),
      AccountMenuComponent.create(),
      AccountComponent.create,
      PostEntryListComponent.create,
      state
    ).init();
  }

  public init(): this {
    this.hide();

    this.logo.addEventListener("mouseover", () => this.highlightLogo());
    this.logo.addEventListener("mouseout", () => this.lowlightLogo());
    this.logo.addEventListener("mouseover", () => this.expandMenu());
    this.logo.addEventListener("mouseout", () => this.collapseMenu());
    this.lowlightLogo();

    this.homeMenuComponent.on("account", () =>
      this.setPage(ContentPage.ACCOUNT)
    );
    this.homeMenuComponent.on("refresh", () => this.refreshNewPosts());
    this.accountMenuComponent.on("home", () => this.setPage(ContentPage.HOME));

    this.lazyAccountComponent = new LazyInstance(() => {
      let component = this.accountComponentFactoryFn();
      this.pageContainer.appendChild(component.body);
      return component;
    });
    this.lazyPostEntryListComponent = new LazyInstance(() => {
      let component = this.postEntryListComponentFactoryFn();
      component.refresh();
      this.pageContainer.appendChild(component.body);
      return component;
    });
    this.showPage(this.state.page);
    this.state.on("page", (value) => this.showPage(value));
    return this;
  }

  private highlightLogo(): void {
    this.logo.style.backgroundColor = SCHEME.menuHighlightBackground;
  }

  private lowlightLogo(): void {
    this.logo.style.backgroundColor = "initial";
  }

  private expandMenu(): void {
    this.menuContainer.expand();
  }

  private collapseMenu(): void {
    this.menuContainer.collapse();
  }

  private setPage(page: ContentPage): void {
    this.state.page = page;
  }

  private async refreshNewPosts(): Promise<void> {
    await this.lazyPostEntryListComponent.get().refresh();
  }

  private showPage(page: ContentPage): void {
    if (!page || page === ContentPage.HOME) {
      this.pageSwitcher.show(
        () => {
          this.menuContainer = this.homeMenuComponent;
          this.lazyAccountComponent.get().show();
        },
        () => {
          this.homeMenuComponent.collapse();
          this.lazyAccountComponent.get().hide();
        }
      );
    } else if (page === ContentPage.ACCOUNT) {
      this.pageSwitcher.show(
        () => {
          this.menuContainer = this.accountMenuComponent;
          this.lazyPostEntryListComponent.get().show();
        },
        () => {
          this.accountMenuComponent.collapse();
          this.lazyPostEntryListComponent.get().hide();
        }
      );
    }
  }

  public show(): void {
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
