import { ContentComponent } from "./content/component";
import { ContentState } from "./content/state";
import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { SignInComponent } from "./sign_in/component";
import { SignUpComponent } from "./sign_up/component";
import { WEB_SERVICE_CLIENT } from "./web_service_client";
import { TabsSwitcher } from "@selfage/tabs";
import { WebServiceClient } from "@selfage/web_service_client";
import { LocalSessionStorage } from "@selfage/web_service_client/local_session_storage";
import { LazyInstance } from "@selfage/once/lazy_instance";

export class BodyController {
  private pageSwitcher = TabsSwitcher.create();
  private lazySignInComponent: LazyInstance<SignInComponent>;
  private lazySignUpComponent: LazyInstance<SignUpComponent>;
  private lazyContentComponent: LazyInstance<ContentComponent>;

  public constructor(
    private body: HTMLElement,
    private signInComponentFactoryFn: () => SignInComponent,
    private signUpComponentFactoryFn: () => SignUpComponent,
    private contentComponentFactoryFn: (
      contentState: ContentState
    ) => ContentComponent,
    private contentState: ContentState,
    private localSessionStorage: LocalSessionStorage,
    private webServiceClient: WebServiceClient
  ) {}

  public static create(
    body: HTMLElement,
    contentState: ContentState
  ): BodyController {
    return new BodyController(
      body,
      SignInComponent.create,
      SignUpComponent.create,
      ContentComponent.create,
      contentState,
      LOCAL_SESSION_STORAGE,
      WEB_SERVICE_CLIENT
    ).init();
  }

  public init(): this {
    this.lazySignInComponent = new LazyInstance(() => {
      let component = this.signInComponentFactoryFn();
      component.on("signUp", () => this.showSignUp());
      component.on("signedIn", () => this.showContent());
      this.body.appendChild(component.body);
      return component;
    });
    this.lazySignUpComponent = new LazyInstance(() => {
      let component = this.signUpComponentFactoryFn();
      component.on("signIn", () => this.showSignIn());
      component.on("signedUp", () => this.showContent());
      this.body.appendChild(component.body);
      return component;
    });
    this.lazyContentComponent = new LazyInstance(() => {
      let component = this.contentComponentFactoryFn(this.contentState);
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
        this.lazySignUpComponent.get().show();
      },
      () => {
        this.lazySignUpComponent.get().hide();
      }
    );
  }

  private showSignIn() {
    this.pageSwitcher.show(
      () => {
        this.lazySignInComponent.get().show();
      },
      () => {
        this.lazySignInComponent.get().hide();
      }
    );
  }

  private showContent() {
    this.pageSwitcher.show(
      () => {
        this.lazyContentComponent.get().show();
      },
      () => {
        this.lazyContentComponent.get().hide();
      }
    );
  }
}
