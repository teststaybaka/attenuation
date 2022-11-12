import { LOCAL_SESSION_STORAGE } from "./common/local_session_storage";
import { WEB_SERVICE_CLIENT } from "./common/web_service_client";
import { ContentPage } from "./content_page/container";
import { ContentState } from "./content_page/state";
import { SignInPage } from "./sign_in_page";
import { SignUpPage } from "./sign_up_page";
import { LazyInstance } from "@selfage/once/lazy_instance";
import { TabsSwitcher } from "@selfage/tabs";
import { WebServiceClient } from "@selfage/web_service_client";
import { LocalSessionStorage } from "@selfage/web_service_client/local_session_storage";

export class BodyContainer {
  private pageSwitcher = TabsSwitcher.create();
  private lazySignInPage: LazyInstance<SignInPage>;
  private lazySignUpPage: LazyInstance<SignUpPage>;
  private lazyContentPage: LazyInstance<ContentPage>;

  public constructor(
    private body: HTMLElement,
    private signInPageFactoryFn: () => SignInPage,
    private signUpPageFactoryFn: () => SignUpPage,
    private contentPageFactoryFn: (contentState: ContentState) => ContentPage,
    private contentState: ContentState,
    private localSessionStorage: LocalSessionStorage,
    private webServiceClient: WebServiceClient
  ) {}

  public static create(
    body: HTMLElement,
    contentState: ContentState
  ): BodyContainer {
    return new BodyContainer(
      body,
      SignInPage.create,
      SignUpPage.create,
      ContentPage.create,
      contentState,
      LOCAL_SESSION_STORAGE,
      WEB_SERVICE_CLIENT
    ).init();
  }

  public init(): this {
    this.lazySignInPage = new LazyInstance(() => {
      let page = this.signInPageFactoryFn();
      page.on("signUp", () => this.showSignUp());
      page.on("signedIn", () => this.showContent());
      this.body.appendChild(page.body);
      return page;
    });
    this.lazySignUpPage = new LazyInstance(() => {
      let page = this.signUpPageFactoryFn();
      page.on("signIn", () => this.showSignIn());
      page.on("signedUp", () => this.showContent());
      this.body.appendChild(page.body);
      return page;
    });
    this.lazyContentPage = new LazyInstance(() => {
      let component = this.contentPageFactoryFn(this.contentState);
      component.on("signOut", () => this.showSignIn());
      this.body.appendChild(component.body);
      return component;
    });

    if (this.localSessionStorage.read()) {
      this.showContent();
    } else {
      this.showSignIn();
    }
    this.webServiceClient.on("unauthenticated", () => {
      this.showSignIn();
    });
    return this;
  }

  private showSignUp() {
    this.pageSwitcher.show(
      () => {
        this.lazySignUpPage.get().show();
      },
      () => {
        this.lazySignUpPage.get().hide();
      }
    );
  }

  private showSignIn() {
    this.pageSwitcher.show(
      () => {
        this.lazySignInPage.get().show();
      },
      () => {
        this.lazySignInPage.get().hide();
      }
    );
  }

  private showContent() {
    this.pageSwitcher.show(
      () => {
        this.lazyContentPage.get().show();
      },
      () => {
        this.lazyContentPage.get().hide();
      }
    );
  }
}
