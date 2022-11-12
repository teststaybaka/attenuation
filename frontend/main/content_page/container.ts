import EventEmitter = require("events");
import { SCHEME } from "../common/color_scheme";
import { AccountPage } from "./account_page/container";
import { PostEntryListPage } from "./post_entry_list_page/container";
import { ContentState, Page } from "./state";
import { E } from "@selfage/element/factory";
import { LazyInstance } from "@selfage/once/lazy_instance";
import { Ref } from "@selfage/ref";
import { TabsSwitcher } from "@selfage/tabs";

export interface ContentPage {
  on(event: "signOut", listener: () => void): this;
}

export class ContentPage extends EventEmitter {
  public body: HTMLDivElement;
  private menuContainer: HTMLDivElement;
  private pageContainer: HTMLDivElement;
  private lazyAccountPage: LazyInstance<AccountPage>;
  private lazyPostEntryListPage: LazyInstance<PostEntryListPage>;
  private pageSwitcher = TabsSwitcher.create();

  public constructor(
    private accountPageFactoryFn: () => AccountPage,
    private postEntryListPageFactoryFn: () => PostEntryListPage,
    private state: ContentState
  ) {
    super();
    let menuContainerRef = new Ref<HTMLDivElement>();
    let pageContainerRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "content",
        style: `flex-flow: row nowrap; width: 100vw; min-height: 100vh; background-color: ${SCHEME.neutral4};`,
      },
      E.div(
        {
          class: "content-left-bar",
          style: `flex: 0 0 5rem;`,
        },
        E.divRef(
          menuContainerRef,
          {
            class: "menu",
            style: `position: relative;`,
          },
          E.div(
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
          )
        )
      ),
      E.divRef(pageContainerRef, {
        class: "main-content-right-container",
        style: `flex: 1 0 0;`,
      })
    );
    this.menuContainer = menuContainerRef.val;
    this.pageContainer = pageContainerRef.val;
    this.hide();

    this.lazyAccountPage = new LazyInstance(() => {
      let page = this.accountPageFactoryFn();
      page.on("home", () => this.setPage(Page.HOME));

      this.menuContainer.append(...page.menuBodies);
      this.pageContainer.appendChild(page.body);
      return page;
    });
    this.lazyPostEntryListPage = new LazyInstance(() => {
      let page = this.postEntryListPageFactoryFn();
      page.on("account", () => this.setPage(Page.ACCOUNT));

      page.refresh();
      this.menuContainer.append(...page.menuBodies);
      this.pageContainer.appendChild(page.body);
      return page;
    });

    this.state.on("page", (value) => this.showPage(value));
    this.showPage(this.state.page);
  }

  public static create(state: ContentState): ContentPage {
    return new ContentPage(AccountPage.create, PostEntryListPage.create, state);
  }

  private setPage(page: Page): void {
    this.state.page = page;
  }

  private showPage(page: Page): void {
    if (!page || page === Page.HOME) {
      this.pageSwitcher.show(
        () => {
          this.lazyPostEntryListPage.get().show();
        },
        () => {
          this.lazyPostEntryListPage.get().hide();
        }
      );
    } else if (page === Page.ACCOUNT) {
      this.pageSwitcher.show(
        () => {
          this.lazyAccountPage.get().show();
        },
        () => {
          this.lazyAccountPage.get().hide();
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
