import { PostEntryCard as PostEntry } from "../../../../interface/post_entry_card";
import { AT_USER } from "../../common/at_user";
import { AvatarUrlComposer } from "../../common/avatar_url_composer";
import { SCHEME } from "../../common/color_scheme";
import { E } from "@selfage/element/factory";

export class PostEntryCard {
  public body: HTMLDivElement;
  private dateFormatter: Intl.DateTimeFormat;

  public constructor(postEntry: PostEntry) {
    this.dateFormatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    this.body = E.div(
      {
        class: "post-entry-card",
        style: `display: flex; flex-flow: column nowrap; width: 60rem; padding: .6rem 1.2rem; margin-left: auto; margin-right: auto; box-sizing: border-box; background-color: ${SCHEME.cardBackground};`,
      },
      E.div(
        {
          class: "post-entry-card-head-line-container",
          style:
            "display: flex; flex-flow: row nowrap; align-items: center; margin-bottom: 1rem;",
        },
        E.image({
          class: "post-entry-card-user-picture",
          style:
            "width: 4.8rem; height: 4.8rem; border-radius: 4.8rem; margin-right: 1rem;",
          src: AvatarUrlComposer.compose(postEntry.avatarSmallPath),
        }),
        E.div(
          {
            class: "post-entry-card-user-info",
            style: "display: flex; flex-flow: column nowrap;",
          },
          E.div(
            {
              class: "post-entry-card-username",
              style: `font-size: 1.6rem; color: ${SCHEME.hintText};`,
            },
            E.text(AT_USER + postEntry.username)
          ),
          E.div(
            {
              class: "post-entry-card-user-nature-name",
              style: `font-size: 1.6rem; color: ${SCHEME.normalText};`,
            },
            E.text(postEntry.userNatureName)
          )
        ),
        E.div(
          {
            class: "post-entry-card-created-timestamp",
            style: `margin-left: auto; font-size: 1.4rem; color: ${SCHEME.hintText};`,
          },
          E.text(
            this.dateFormatter.format(new Date(postEntry.createdTimestamp))
          )
        )
      ),
      E.div(
        {
          class: "post-entry-card-content-container",
        },
        E.div(
          {
            class: "post-entry-card-content",
            style: `font-size: 1.6rem; white-space: pre-wrap; color: ${SCHEME.normalText};`,
          },
          E.text(postEntry.content)
        )
      )
    );
  }

  public static create(postEntry: PostEntry): PostEntryCard {
    return new PostEntryCard(postEntry);
  }
}
