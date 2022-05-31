import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { MainContentComponent } from "./main_content/component";
import { MainContentState } from "./main_content/state";
import { SERVICE_CLIENT } from "./service_client";
import { SignInComponent } from "./sign_in/component";
import { SignUpComponent } from "./sign_up/component";
import { ServiceClient } from "@selfage/service_client";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";
import { TabsSwitcher } from "@selfage/tabs";

export class MainController {
  private pageSwitcher = TabsSwitcher.create();
  private signInComponent: SignInComponent;
  private signUpComponent: SignUpComponent;
  private mainContentComponent: MainContentComponent;

  public constructor(
    private body: HTMLElement,
    private signInComponentFactoryFn: () => SignInComponent,
    private signUpComponentFactoryFn: () => SignUpComponent,
    private mainContentComponentFactoryFn: (
      mainContentState: MainContentState
    ) => MainContentComponent,
    private mainContentState: MainContentState,
    private localSessionStorage: LocalSessionStorage,
    private serviceClient: ServiceClient
  ) {}

  public static create(
    body: HTMLElement,
    mainContentState: MainContentState
  ): MainController {
    return new MainController(
      body,
      SignInComponent.create,
      SignUpComponent.create,
      MainContentComponent.create,
      mainContentState,
      LOCAL_SESSION_STORAGE,
      SERVICE_CLIENT
    ).init();
  }

  public init(): this {
    if (this.localSessionStorage.read()) {
      this.showMainContent();
    } else {
      this.showSignIn();
    }
    this.serviceClient.on("unauthenticated", () => {
      this.showSignIn();
    });
    return this;
  }

  private showSignUp() {
    this.pageSwitcher.show(
      () => {
        this.signUpComponent = this.signUpComponentFactoryFn();
        this.signUpComponent.on("signIn", () => this.showSignIn());
        this.signUpComponent.on("signedUp", () => this.showMainContent());
        this.body.appendChild(this.signUpComponent.body);
      },
      () => {
        this.signUpComponent.remove();
      }
    );
  }

  private showSignIn() {
    this.pageSwitcher.show(
      () => {
        this.signInComponent = this.signInComponentFactoryFn();
        this.signInComponent.on("signUp", () => this.showSignUp());
        this.signInComponent.on("signedIn", () => this.showMainContent());
        this.body.appendChild(this.signInComponent.body);
      },
      () => {
        this.signInComponent.remove();
      }
    );
  }

  private showMainContent() {
    this.pageSwitcher.show(
      () => {
        this.mainContentComponent = this.mainContentComponentFactoryFn(
          this.mainContentState
        );
        this.mainContentComponent.show();
        this.mainContentComponent.on("signOut", () => this.showSignIn());
        this.body.appendChild(this.mainContentComponent.body);
      },
      () => {
        this.mainContentComponent.remove();
      }
    );
  }
}
