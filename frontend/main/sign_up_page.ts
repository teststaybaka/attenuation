import EventEmitter = require("events");
import { FillButton } from "./common/button";
import { newSignUpServiceRequest } from "./common/client_requests";
import { SCHEME } from "./common/color_scheme";
import { LOCAL_SESSION_STORAGE } from "./common/local_session_storage";
import { LOCALIZED_TEXT } from "./common/locales/localized_text";
import { WEB_SERVICE_CLIENT } from "./common/web_service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";
import { LocalSessionStorage } from "@selfage/web_service_client/local_session_storage";

export interface SignUpPage {
  on(event: "signIn", listener: () => void): this;
  on(event: "signedUp", listener: () => void): this;
}

export class SignUpPage extends EventEmitter {
  public body: HTMLDivElement;
  private usernameInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;
  private switcherToSignInButton: HTMLDivElement;

  public constructor(
    private submitButton: FillButton,
    private localSessionStorage: LocalSessionStorage,
    private webServiceClient: WebServiceClient
  ) {
    super();
    let usernameInputRef = new Ref<HTMLInputElement>();
    let passwordInputRef = new Ref<HTMLInputElement>();
    let switcherToSignInButtonRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "sign-up",
        style: `flex-flow: column nowrap; justify-content: center; align-items: center; width: 100vw; min-height: 100vh;`,
      },
      E.div(
        {
          class: "sign-up-box",
          style: `display: flex; flex-flow: column nowrap; width: 50rem; padding: 1rem 0;`,
        },
        E.div(
          {
            class: "sign-up-username-label",
            style: `color: ${SCHEME.normalText}; font-size: 1.6rem; margin: 1rem 5rem;`,
          },
          E.text(LOCALIZED_TEXT.usernameLabel)
        ),
        E.inputRef(usernameInputRef, {
          class: "sign-up-username-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; margin: 1rem 5rem; color: ${SCHEME.normalText}; font-size: 1.6rem; line-height: 2.2rem; border-bottom: .1rem solid ${SCHEME.inputBorder};`,
          autocomplete: "username",
        }),
        E.div(
          {
            class: "sign-up-password-label",
            style: `color: ${SCHEME.normalText}; font-size: 1.6rem; margin: 1rem 5rem;`,
          },
          E.text(LOCALIZED_TEXT.passwordLabel)
        ),
        E.inputRef(passwordInputRef, {
          class: "sign-up-password-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; margin: 1rem 5rem; color: ${SCHEME.normalText}; font-size: 1.6rem; line-height: 2.2rem; border-bottom: .1rem solid ${SCHEME.inputBorder};`,
          type: "password",
          autocomplete: "new-password",
        }),
        E.divRef(
          switcherToSignInButtonRef,
          {
            class: "sign-up-switch-to-sign-in",
            style: `margin: 1rem 5rem; font-size: 1.4rem; color: ${SCHEME.hintText}; cursor: pointer;`,
          },
          E.text(LOCALIZED_TEXT.switchToSignInLink)
        ),
        E.div(
          {
            class: "sign-up-submit-button-wrapper",
            style: `margin: 1rem 5rem; align-self: flex-end;`,
          },
          submitButton.body
        )
      )
    );
    this.usernameInput = usernameInputRef.val;
    this.passwordInput = passwordInputRef.val;
    this.switcherToSignInButton = switcherToSignInButtonRef.val;

    this.submitButton.on("click", () => this.signUp());
    this.switcherToSignInButton.addEventListener("click", () =>
      this.switchToSignIn()
    );
    this.hide();
  }

  public static create(): SignUpPage {
    return new SignUpPage(
      FillButton.create(true, E.text(LOCALIZED_TEXT.signUpButtonLabel)),
      LOCAL_SESSION_STORAGE,
      WEB_SERVICE_CLIENT
    );
  }

  private async signUp(): Promise<void> {
    await this.sendSignUpRequest();
    this.emit("signedUp");
  }

  protected async sendSignUpRequest(): Promise<void> {
    let response = await this.webServiceClient.send(
      newSignUpServiceRequest({
        body: {
          username: this.usernameInput.value,
          password: this.passwordInput.value,
        },
      })
    );
    this.localSessionStorage.save(response.signedSession);
  }

  private switchToSignIn(): void {
    this.emit("signIn");
  }

  public show(): void {
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
