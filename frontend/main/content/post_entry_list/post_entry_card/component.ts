import { PostEntryCard } from "../../../../../interface/post_entry_card";
import { AVATAR_URL_COMPOSER } from "../../../../common/avatar_url_composer";
import { AT_USER } from "../../../common/at_user";
import { SCHEME } from "../../../common/color_scheme";
import { E } from "@selfage/element/factory";

export class PostEntryCardComponent {
  public body: HTMLDivElement;
  private dateFormatter: Intl.DateTimeFormat;

  public constructor(postEntryCard: PostEntryCard) {
    this.dateFormatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    this.body = E.div(
      {
        class: "post-entry",
        style: `display: flex; flex-flow: column nowrap; width: 60rem; padding: .6rem 1.2rem; margin-left: auto; margin-right: auto; box-sizing: border-box; background-color: ${SCHEME.cardBackground};`,
      },
      E.div(
        {
          class: "post-entry-head-line-container",
          style:
            "display: flex; flex-flow: row nowrap; align-items: center; margin-bottom: 1rem;",
        },
        E.image({
          class: "post-entry-user-picture",
          style:
            "width: 4.8rem; height: 4.8rem; border-radius: 4.8rem; margin-right: 1rem;",
          src: AVATAR_URL_COMPOSER.compose(postEntryCard.avatarSmallPath),
        }),
        E.div(
          {
            class: "post-entry-user-info",
            style: "display: flex; flex-flow: column nowrap;",
          },
          E.div(
            {
              class: "post-entry-username",
              style: `font-size: 1.6rem; color: ${SCHEME.hintText};`,
            },
            E.text(AT_USER + postEntryCard.username)
          ),
          E.div(
            {
              class: "post-entry-user-nature-name",
              style: `font-size: 1.6rem; color: ${SCHEME.normalText};`,
            },
            E.text(postEntryCard.userNatureName)
          )
        ),
        E.div(
          {
            class: "post-entry-created-timestamp",
            style: `margin-left: auto; font-size: 1.4rem; color: ${SCHEME.hintText};`,
          },
          E.text(
            this.dateFormatter.format(new Date(postEntryCard.createdTimestamp))
          )
        )
      ),
      E.div(
        {
          class: "post-entry-content-container",
        },
        E.div(
          {
            class: "post-entry-content",
            style: `font-size: 1.6rem; white-space: pre-wrap; color: ${SCHEME.normalText};`,
          },
          E.text(postEntryCard.content)
        )
      )
    );
  }

  public static create(postEntry: PostEntryCard): PostEntryCardComponent {
    return new PostEntryCardComponent(postEntry);
  }
}
