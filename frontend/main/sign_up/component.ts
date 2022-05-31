import EventEmitter = require("events");
import { SIGN_UP } from "../../../interface/service";
import { FillButtonComponent } from "../common/button/component";
import { SCHEME } from "../common/color_scheme";
import { LOCALIZED_TEXT } from "../common/locales/localized_text";
import { LOCAL_SESSION_STORAGE } from "../local_session_storage";
import { SERVICE_CLIENT } from "../service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";

export interface SignUpComponent {
  on(event: "signIn", listener: () => void): this;
  on(event: "signedUp", listener: () => void): this;
}

export class SignUpComponent extends EventEmitter {
  public body: HTMLDivElement;
  private usernameInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;
  private switcherToSignInButton: HTMLDivElement;

  public constructor(
    private submitButton: FillButtonComponent,
    private localSessionStorage: LocalSessionStorage,
    private serviceClient: ServiceClient
  ) {
    super();
    let usernameInputRef = new Ref<HTMLInputElement>();
    let passwordInputRef = new Ref<HTMLInputElement>();
    let switcherToSignInButtonRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "sign-up",
        style: `display: flex; flex-flow: column nowrap; justify-content: center; align-items: center; width: 100vw; min-height: 100vh;`,
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
          style: `padding: 0; margin: 0; outline: none; border: 0; margin: 1rem 5rem; color: ${SCHEME.normalText}; font-size: 1.6rem; line-height: 2.2rem; border-bottom: .1rem solid ${SCHEME.inputBorder};`,
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
          style: `padding: 0; margin: 0; outline: none; border: 0; margin: 1rem 5rem; color: ${SCHEME.normalText}; font-size: 1.6rem; line-height: 2.2rem; border-bottom: .1rem solid ${SCHEME.inputBorder};`,
          type: "password",
          autocomplete: "current-password",
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
  }

  public static create(): SignUpComponent {
    return new SignUpComponent(
      FillButtonComponent.create(
        true,
        E.text(LOCALIZED_TEXT.signUpButtonLabel)
      ),
      LOCAL_SESSION_STORAGE,
      SERVICE_CLIENT
    ).init();
  }

  private init(): this {
    this.submitButton.on("click", () => this.signUp());
    this.switcherToSignInButton.addEventListener("click", () =>
      this.switchToSignIn()
    );
    return this;
  }

  private async signUp(): Promise<void> {
    let response = await this.serviceClient.fetchUnauthed(
      {
        username: this.usernameInput.value,
        password: this.passwordInput.value,
      },
      SIGN_UP
    );
    this.localSessionStorage.save(response.signedSession);
    this.emit("signedUp");
  }

  private switchToSignIn(): void {
    this.emit("signIn");
  }

  public remove(): void {
    this.body.remove();
  }
}
