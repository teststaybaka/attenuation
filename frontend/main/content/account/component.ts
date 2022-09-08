import { AVATAR_URL_COMPOSER } from "../../../common/avatar_url_composer";
import { newGetUserInfoServiceRequest } from "../../../common/client_requests";
import { SCHEME } from "../../common/color_scheme";
import { LOCALIZED_TEXT } from "../../common/locales/localized_text";
import { WEB_SERVICE_CLIENT } from "../../web_service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

let INPUT_LINE_STYLE = `display: flex; flex-flow: row nowrap; box-sizing: border-box; width: 100%; padding: 0 10% 2.5rem; line-height: 2rem;`;
let LABEL_STYLE = `flex: 0 0 12rem; font-size: 1.4rem; color: ${SCHEME.normalText};`;
let VALUE_TEXT_STYLE = `flex: 1 0 0; font-size: 1.4rem; color: ${SCHEME.normalText};`;

export class AccountComponent {
  public body: HTMLDivElement;
  private card: HTMLDivElement;
  private avatarContainer: HTMLDivElement;
  private avatarImage: HTMLImageElement;
  private avatarChangeHint: HTMLDivElement;
  private usernameValue: HTMLDivElement;
  private naturalNameValue: HTMLDivElement;
  private emailValue: HTMLDivElement;

  public constructor(private webServiceClient: WebServiceClient) {
    let cardRef = new Ref<HTMLDivElement>();
    let avatarContainerRef = new Ref<HTMLDivElement>();
    let avatarImagePef = new Ref<HTMLImageElement>();
    let avatarChangeHintRef = new Ref<HTMLDivElement>();
    let usernameValueRef = new Ref<HTMLDivElement>();
    let naturalNameValueRef = new Ref<HTMLDivElement>();
    let emailValueRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "account-basic",
        style: `flex-flow: row nowrap; justify-content: center; height: 100%; width: 100%;`,
      },
      E.divRef(
        cardRef,
        {
          class: "account-basic-card",
          style: `display: flex; flex-flow: column nowrap; align-items: center; flex: 0 0; height: 100%; background-color: ${SCHEME.cardBackground}; overflow-y: auto;`,
        },
        E.divRef(
          avatarContainerRef,
          {
            class: "account-basic-avatar",
            style: `position: relative; height: 10rem; width: 10rem; border-radius: 10rem; margin: 5rem;`,
          },
          E.imageRef(avatarImagePef, {
            class: "account-basic-avatar-image",
            style: `height: 100%; width: 100%;`,
          }),
          E.divRef(
            avatarChangeHintRef,
            {
              class: "account-basic-avatar-change-hint-background",
              style: `position: absolute; flex-flow: row nowrap; justify-content: center; align-items: center; top: 0; left: 0; height: 100%; width: 100%; background-color: ${SCHEME.shadowCover};`,
            },
            E.div(
              {
                class: `account-basic-avatar-change-hint-label`,
                style: `color: ${SCHEME.shadowText};`,
              },
              E.text(LOCALIZED_TEXT.changeAvatarLabel)
            )
          )
        ),
        E.div(
          {
            class: "account-basic-change-avatar-container",
          },
          E.div(
            {
              class: "account-basic-change-avatar-canvas",
              style: `position: relative;`,
            },
            E.div(
              {
                class: "account-basic-change-avatar-placeholder",
                style: `height: 100%; width: 100%;`
              },
              E.text(LOCALIZED_TEXT.uploadAvatarLabel)
            )
          ),
          E.div(
            {
              class: "account-basic-change-avatar-previews",
            },
            E.div({
              class: "account-basic-change-avatar-preview-small",
            }),
            E.div({
              class: "account-basic-change-avatar-preview-large",
            })
          )
        ),
        E.div(
          {
            class: "account-basic-username",
            style: INPUT_LINE_STYLE,
          },
          E.div(
            {
              class: "account-basic-username-label",
              style: LABEL_STYLE,
            },
            E.text(LOCALIZED_TEXT.usernameLabel)
          ),
          E.divRef(usernameValueRef, {
            class: "account-basic-username-value",
            style: VALUE_TEXT_STYLE,
          })
        ),
        E.div(
          {
            class: "account-basic-natural-name",
            style: INPUT_LINE_STYLE,
          },
          E.div(
            {
              class: "account-basic-natural-name-label",
              style: LABEL_STYLE,
            },
            E.text(LOCALIZED_TEXT.naturalNameLabel)
          ),
          E.divRef(naturalNameValueRef, {
            class: "account-basic-natural-name-value",
            style: VALUE_TEXT_STYLE,
          })
        ),
        E.div(
          {
            class: "account-basic-email",
            style: INPUT_LINE_STYLE,
          },
          E.div(
            {
              class: "account-basic-email-label",
              style: LABEL_STYLE,
            },
            E.text(LOCALIZED_TEXT.emailLabel)
          ),
          E.divRef(emailValueRef, {
            class: "account-basic-email-value",
            style: VALUE_TEXT_STYLE,
          })
        )
      )
    );
    this.card = cardRef.val;
    this.avatarContainer = avatarContainerRef.val;
    this.avatarImage = avatarImagePef.val;
    this.avatarChangeHint = avatarChangeHintRef.val;
    this.usernameValue = usernameValueRef.val;
    this.naturalNameValue = naturalNameValueRef.val;
    this.emailValue = emailValueRef.val;
  }

  public static create(): AccountComponent {
    return new AccountComponent(WEB_SERVICE_CLIENT).init();
  }

  public init(): this {
    let observer = new ResizeObserver((entries) => {
      this.resize(entries[0]);
    });
    observer.observe(this.body);

    this.avatarContainer.addEventListener("mouseenter", () =>
      this.showChangeAvatarHint()
    );
    this.avatarContainer.addEventListener("mouseleave", () =>
      this.hideChangeAvatarHint()
    );
    this.avatarContainer.addEventListener("click", () =>
      this.showChangeAvatarInput()
    );
    return this;
  }

  private resize(entry: ResizeObserverEntry): void {
    if (entry.contentRect.width > 1000) {
      this.card.style.flexBasis = "80%";
    } else {
      this.card.style.flexBasis = "100%";
    }
  }

  private showChangeAvatarHint(): void {
    this.avatarChangeHint.style.display = "flex";
  }

  private hideChangeAvatarHint(): void {
    this.avatarChangeHint.style.display = "none";
  }

  private showChangeAvatarInput(): void {}

  public async refresh(): Promise<void> {
    let response = await this.webServiceClient.send(
      newGetUserInfoServiceRequest({ body: {} })
    );
    this.usernameValue.textContent = response.username;
    this.naturalNameValue.textContent = response.naturalName;
    this.emailValue.textContent = response.email;
    this.avatarImage.src = AVATAR_URL_COMPOSER.compose(
      response.avatarLargePath
    );
  }

  public show(): void {
    this.body.style.display = "flex";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
