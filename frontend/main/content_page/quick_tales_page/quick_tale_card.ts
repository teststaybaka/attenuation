import EventEmitter = require("events");
import { TaleCard } from "../../../../interface/tale";
import { TaleReaction } from "../../../../interface/tale_reaction";
import { AT_USER } from "../../common/at_user";
import { AvatarUrlComposer } from "../../common/avatar_url_composer";
import { SCHEME } from "../../common/color_scheme";
import {
  createAngerIcon,
  createDoubleArrowsIcon,
  createEllipsisIcon,
  createFilledHeartIcon,
  createFilledThumbUpIcon,
  createHeartIcon,
  createPlusIcon,
  createThumbUpIcon,
} from "../../common/icons";
import { LOCALIZED_TEXT } from "../../common/locales/localized_text";
import { newReactToTaleServiceRequest } from "../../common/tale_service_requests";
import { WEB_SERVICE_CLIENT } from "../../common/web_service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { TabsSwitcher } from "@selfage/tabs";
import { WebServiceClient } from "@selfage/web_service_client";

export interface QuickTaleCard {
  on(event: "load", listener: () => void): this;
  on(event: "asContext", listener: (taleId: string) => void): this;
  on(
    event: "imageViewer",
    listener: (imageUrls: Array<string>, index: number) => void
  ): this;
  on(event: "actionsLineTranstionEnd", listener: () => void): this;
  on(event: "delete", listener: () => void): this;
}

export class QuickTaleCard extends EventEmitter {
  private static CONTENT_LINE_HEIGHT = 1.8;
  private static ACTION_BUTTON_SIZE = 5;
  private static DELETE_DELAY = 1000; // ms

  public body: HTMLDivElement;
  private textContent: HTMLDivElement;
  private showMoreButton: HTMLDivElement;
  private showLessButton: HTMLDivElement;
  private actionsExpandButton: HTMLDivElement;
  private actionsLine: HTMLDivElement;
  private actionsCollapseButton: HTMLDivElement;
  private loveButton: HTMLDivElement;
  private lovedButton: HTMLDivElement;
  private likeButton: HTMLDivElement;
  private likedButton: HTMLDivElement;
  private dislikeButton: HTMLDivElement;
  private dislikedButton: HTMLDivElement;
  private hateButton: HTMLDivElement;
  private hatedButton: HTMLDivElement;
  private dismissButton: HTMLDivElement;
  private reaction: TaleReaction;
  private timeoutHandle: number;
  private switcher = new TabsSwitcher();

  public constructor(
    private taleCard: TaleCard,
    private webServiceClient: WebServiceClient,
    private window: Window
  ) {
    super();
    let dateFormatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    let actionsExpandButtonRef = new Ref<HTMLDivElement>();
    let actionsLineRef = new Ref<HTMLDivElement>();
    let actionsCollapseButtonRef = new Ref<HTMLDivElement>();
    let loveButtonRef = new Ref<HTMLDivElement>();
    let lovedButtonRef = new Ref<HTMLDivElement>();
    let likeButtonRef = new Ref<HTMLDivElement>();
    let likedButtonRef = new Ref<HTMLDivElement>();
    let dislikeButtonRef = new Ref<HTMLDivElement>();
    let dislikedButtonRef = new Ref<HTMLDivElement>();
    let hateButtonRef = new Ref<HTMLDivElement>();
    let hatedButtonRef = new Ref<HTMLDivElement>();
    let dismissButtonRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "quick-tale-card",
        style: `display: flex; flex-flow: column nowrap; gap: 1rem; width: 60rem; padding: .6rem 1.2rem; border-bottom: .1rem solid ${SCHEME.neutral3}; box-sizing: border-box; overflow: hidden; background-color: ${SCHEME.neutral4}; margin-left: auto; margin-right: auto; cursor: pointer;`,
      },
      ...this.createTextContent(taleCard.quickLayoutTale.text),
      ...this.createPreviewImages(taleCard.quickLayoutTale.images),
      E.div(
        {
          class: "quick-tale-card-meta-line",
          style: `position: relative; display: flex; flex-flow: row nowrap; align-items: center; gap: 1rem; width: 100%;`,
        },
        E.image({
          class: "quick-tale-card-user-picture",
          style: `flex: 0 0 auto; width: 4.8rem; height: 4.8rem; border-radius: 4.8rem;`,
          src: AvatarUrlComposer.compose(taleCard.avatarSmallPath),
        }),
        E.div(
          {
            class: "quick-tale-card-user-info",
            style: `flex: 1 1 auto; display: flex; flex-flow: column nowrap; overflow: hidden;`,
          },
          E.div(
            {
              class: "quick-tale-card-user-nature-name",
              style: `font-size: 1.6rem; color: ${SCHEME.neutral0};`,
            },
            E.text(taleCard.userNatureName)
          ),
          E.div(
            {
              class: "quick-tale-card-username",
              style: `font-size: 1.4rem; color: ${SCHEME.neutral2};`,
            },
            E.text(AT_USER + taleCard.username)
          )
        ),
        E.div(
          {
            class: "quick-tale-card-created-timestamp",
            style: `flex: 0 0 auto; font-size: 1.4rem; color: ${SCHEME.neutral2};`,
          },
          E.text(dateFormatter.format(new Date(taleCard.createdTimestamp)))
        ),
        E.divRef(
          actionsExpandButtonRef,
          {
            class: "quick-tale-card-actions-expand-button",
            style: `width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box; padding: 1rem;`,
          },
          createEllipsisIcon(SCHEME.neutral2)
        ),
        E.divRef(
          actionsLineRef,
          {
            class: "quick-tale-card-actions-line",
            style: `position: absolute; height: 100%; background-color: ${SCHEME.neutral4}; right: 0; top: 0; transition: width .3s linear; overflow: hidden; display: flex; flex-flow: row-reverse nowrap; justify-content: space-between; align-items: center;`,
          },
          E.divRef(
            actionsCollapseButtonRef,
            {
              class: "quick-tale-card-collapse-button",
              style: `width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box;padding: 1.7rem; rotate: 180deg;`,
            },
            createDoubleArrowsIcon(SCHEME.neutral2)
          ),
          E.divRef(
            loveButtonRef,
            {
              class: "quick-tale-card-love-button",
              style: `width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box;padding: 1.3rem;`,
            },
            createHeartIcon(SCHEME.neutral1)
          ),
          E.divRef(
            lovedButtonRef,
            {
              class: "quick-tale-card-loved-button",
              style: `display: none; width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box; padding: 1.3rem;`,
            },
            createFilledHeartIcon(SCHEME.heart)
          ),
          E.divRef(
            likeButtonRef,
            {
              class: "quick-tale-card-like-button",
              style: `width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box;padding: 1.3rem;`,
            },
            createThumbUpIcon(SCHEME.neutral1)
          ),
          E.divRef(
            likedButtonRef,
            {
              class: "quick-tale-card-liked-button",
              style: `display: none; width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box; padding: 1.3rem;`,
            },
            createFilledThumbUpIcon(SCHEME.thumbUp)
          ),
          E.divRef(
            dislikeButtonRef,
            {
              class: "quick-tale-card-dislike-button",
              style: `width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box;padding: 1.3rem; rotate: 180deg;`,
            },
            createThumbUpIcon(SCHEME.neutral1)
          ),
          E.divRef(
            dislikedButtonRef,
            {
              class: "quick-tale-card-disliked-button",
              style: `display: none; width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box; padding: 1.3rem; rotate: 180deg;`,
            },
            createFilledThumbUpIcon(SCHEME.thumbUp)
          ),
          E.divRef(
            hateButtonRef,
            {
              class: "quick-tale-card-hate-button",
              style: `width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box;padding: 1.3rem;`,
            },
            createAngerIcon(SCHEME.neutral1)
          ),
          E.divRef(
            hatedButtonRef,
            {
              class: "quick-tale-card-hated-button",
              style: `display: none; width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box; padding: 1.3rem;`,
            },
            createAngerIcon(SCHEME.anger)
          ),
          E.divRef(
            dismissButtonRef,
            {
              class: "quick-tale-card-dismiss-button",
              style: `width: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; height: ${QuickTaleCard.ACTION_BUTTON_SIZE}rem; box-sizing: border-box; padding: 1.7rem; rotate: 45deg;`,
            },
            createPlusIcon(SCHEME.neutral2)
          )
        )
      )
    );
    this.actionsExpandButton = actionsExpandButtonRef.val;
    this.actionsLine = actionsLineRef.val;
    this.actionsCollapseButton = actionsCollapseButtonRef.val;
    this.loveButton = loveButtonRef.val;
    this.lovedButton = lovedButtonRef.val;
    this.likeButton = likeButtonRef.val;
    this.likedButton = likedButtonRef.val;
    this.dislikeButton = dislikeButtonRef.val;
    this.dislikedButton = dislikedButtonRef.val;
    this.hateButton = hateButtonRef.val;
    this.hatedButton = hatedButtonRef.val;
    this.dismissButton = dismissButtonRef.val;

    this.hideActions();
    this.actionsExpandButton.addEventListener("click", () =>
      this.showActions()
    );
    this.actionsCollapseButton.addEventListener("click", () =>
      this.hideActions()
    );
    this.actionsLine.addEventListener("transitionend", () =>
      this.emit("actionsLineTranstionEnd")
    );
    this.loveButton.addEventListener("click", this.love);
    this.lovedButton.addEventListener("click", this.unlove);
    this.likeButton.addEventListener("click", this.like);
    this.likedButton.addEventListener("click", this.unlike);
    this.dislikeButton.addEventListener("click", this.dislike);
    this.dislikedButton.addEventListener("click", this.undislike);
    this.hateButton.addEventListener("click", this.hate);
    this.hatedButton.addEventListener("click", this.unhate);
    this.dismissButton.addEventListener("click", this.dismiss);
    this.body.addEventListener("click", () =>
      this.emit("asContext", taleCard.taleId)
    );
  }

  public static create(taleCard: TaleCard): QuickTaleCard {
    return new QuickTaleCard(taleCard, WEB_SERVICE_CLIENT, window);
  }

  private createTextContent(text?: string): Array<HTMLElement> {
    if (!text) {
      return [];
    }

    let textContentRef = new Ref<HTMLDivElement>();
    let showMoreButtonRef = new Ref<HTMLDivElement>();
    let showLessButtonRef = new Ref<HTMLDivElement>();
    let wrapper = E.div(
      {
        class: "quick-tale-card-text-content-wrapper",
      },
      E.divRef(
        textContentRef,
        {
          class: "quick-tale-card-text-content",
          style: `font-size: 1.6rem; line-height: ${
            QuickTaleCard.CONTENT_LINE_HEIGHT
          }rem; white-space: pre-wrap; color: ${SCHEME.neutral0}; max-height: ${
            QuickTaleCard.CONTENT_LINE_HEIGHT * 4
          }rem; overflow: hidden;`,
        },
        E.text(text)
      ),
      E.divRef(
        showMoreButtonRef,
        {
          class: "quick-tale-card-text-content-show-more-button",
          style: `display: none; font-size: 1.4rem; line-height: ${QuickTaleCard.CONTENT_LINE_HEIGHT}rem; color: ${SCHEME.primary0};`,
        },
        E.text(LOCALIZED_TEXT.showMoreButtonLabel)
      ),
      E.divRef(
        showLessButtonRef,
        {
          class: "quick-tale-card-text-content-show-less-button",
          style: `display: none; font-size: 1.4rem; line-height: ${QuickTaleCard.CONTENT_LINE_HEIGHT}rem; color: ${SCHEME.neutral2};`,
        },
        E.text(LOCALIZED_TEXT.showLessButtonLabel)
      )
    );
    this.textContent = textContentRef.val;
    this.showMoreButton = showMoreButtonRef.val;
    this.showLessButton = showLessButtonRef.val;

    this.onTextContentRendered(() =>
      this.checkTextContentHeightAndInitButtons()
    );
    this.showMoreButton.addEventListener("click", () => this.showMoreContent());
    this.showLessButton.addEventListener("click", () => this.showLessContent());
    return [wrapper];
  }

  private onTextContentRendered(listener: () => void): void {
    let resizeObserver = new ResizeObserver((entries) => {
      listener();
      resizeObserver.unobserve(this.textContent);
    });
    resizeObserver.observe(this.textContent);
  }

  private checkTextContentHeightAndInitButtons(): void {
    if (this.textContent.scrollHeight <= this.textContent.clientHeight) {
      return;
    }
    this.textContent.style.maxHeight = "unset";
    this.showLessContent();
  }

  private showMoreContent(): void {
    this.textContent.style.height = "unset";
    this.showMoreButton.style.display = "none";
    this.showLessButton.style.display = "block";
  }

  private showLessContent(): void {
    this.textContent.style.height = `${
      QuickTaleCard.CONTENT_LINE_HEIGHT * 3
    }rem`;
    this.showMoreButton.style.display = "block";
    this.showLessButton.style.display = "none";
  }

  private createPreviewImages(imageUrls?: Array<string>): Array<HTMLElement> {
    if (!imageUrls || imageUrls.length === 0) {
      return [];
    } else if (imageUrls.length === 1) {
      return [
        this.createSinglePreviewImage(imageUrls[0], () => this.emit("load")),
      ];
    } else {
      let loadedCount = 0;
      return [
        E.div(
          {
            class: "quick-tale-card-images",
            style: `display: flex; flex-flow: row wrap; gap: 1rem; justify-content: space-between; align-items: center;`,
          },
          ...imageUrls.map((imageUrl, index, imageUrls) =>
            this.createTilePreviewImage(imageUrl, index, imageUrls, () => {
              loadedCount += 1;
              if (loadedCount >= imageUrls.length) {
                this.emit("load");
              }
            })
          )
        ),
      ];
    }
  }

  private createSinglePreviewImage(
    imageUrl: string,
    onload: () => void
  ): HTMLElement {
    let imageElement = E.image({
      class: "quick-tale-card-single-preview-image",
      style: `flex: 0 0 auto; align-self: center;`,
      src: imageUrl,
    });
    imageElement.onload = () => {
      if (imageElement.naturalHeight > imageElement.naturalWidth) {
        imageElement.style.maxHeight = `25rem`;
      } else {
        imageElement.style.maxWidth = `25rem`;
      }
      onload();
    };
    imageElement.addEventListener("click", () =>
      this.emit("imageViewer", [imageUrl], 0)
    );
    return imageElement;
  }

  private createTilePreviewImage(
    imageUrl: string,
    index: number,
    imageUrls: Array<string>,
    onload: () => void
  ): HTMLElement {
    let imageElementRef = new Ref<HTMLImageElement>();
    let container = E.div(
      {
        class: "quick-tale-card-tile-preview-image-container",
        style: `flex: 0 0 auto; width: 15rem; height: 15rem; overflow: hidden; display: flex; flex-flow: row nowrap; justify-content: center; align-items: center;`,
      },
      E.imageRef(imageElementRef, {
        class: "quick-tale-card-tile-preview-image",
        style: `flex: 0 0 auto;`,
        src: imageUrl,
      })
    );
    let imageElement = imageElementRef.val;
    imageElement.onload = () => {
      if (imageElement.naturalHeight > imageElement.naturalWidth) {
        imageElement.style.width = `100%`;
      } else {
        imageElement.style.height = `100%`;
      }
      onload();
    };
    imageElement.addEventListener("click", () =>
      this.emit("imageViewer", imageUrls, index)
    );
    return container;
  }

  private hideActions(): void {
    this.actionsLine.style.width = `0`;
  }

  private showActions(): void {
    this.actionsLine.style.width = `100%`;
  }

  private love = (): void => {
    this.switcher.show(() => {
      this.loveButton.style.display = "none";
      this.lovedButton.style.display = "block";
      this.reaction = TaleReaction.LOVE;
      this.timeoutHandle = this.window.setTimeout(
        () => this.reactAndDelete(),
        QuickTaleCard.DELETE_DELAY
      );
    }, this.unlove);
  };

  private unlove = (): void => {
    this.loveButton.style.display = "block";
    this.lovedButton.style.display = "none";
    this.stopReacting();
  };

  private stopReacting(): void {
    this.reaction = undefined;
    this.window.clearTimeout(this.timeoutHandle);
  }

  private async reactAndDelete(): Promise<void> {
    this.loveButton.removeEventListener("click", this.love);
    this.lovedButton.removeEventListener("click", this.unlove);
    this.likeButton.removeEventListener("click", this.like);
    this.likedButton.removeEventListener("click", this.unlike);
    this.dislikeButton.removeEventListener("click", this.dislike);
    this.dislikedButton.removeEventListener("click", this.undislike);
    this.hateButton.removeEventListener("click", this.hate);
    this.hatedButton.removeEventListener("click", this.unhate);
    this.dismissButton.removeEventListener("click", this.dismiss);

    this.body.style.height = `${this.body.clientHeight}px`;
    this.body.clientHeight; // Force reflow.
    this.body.style.transition = "height .5s linear";
    this.body.style.height = "0";
    await Promise.all([
      new Promise<void>((resolve) => {
        this.body.addEventListener("transitionend", () => {
          this.body.remove();
          resolve();
        });
      }),
      this.webServiceClient.send(
        newReactToTaleServiceRequest({
          body: {
            taleId: this.taleCard.taleId,
            reaction: this.reaction,
          },
        })
      ),
    ]);
    this.emit("delete");
  }

  private like = (): void => {
    this.switcher.show(() => {
      this.likeButton.style.display = "none";
      this.likedButton.style.display = "block";
      this.reaction = TaleReaction.LIKE;
      this.timeoutHandle = this.window.setTimeout(
        () => this.reactAndDelete(),
        QuickTaleCard.DELETE_DELAY
      );
    }, this.unlike);
  };

  private unlike = (): void => {
    this.likeButton.style.display = "block";
    this.likedButton.style.display = "none";
    this.stopReacting();
  };

  private dislike = (): void => {
    this.switcher.show(() => {
      this.dislikeButton.style.display = "none";
      this.dislikedButton.style.display = "block";
      this.reaction = TaleReaction.DISLIKE;
      this.timeoutHandle = this.window.setTimeout(
        () => this.reactAndDelete(),
        QuickTaleCard.DELETE_DELAY
      );
    }, this.undislike);
  };

  private undislike = (): void => {
    this.dislikeButton.style.display = "block";
    this.dislikedButton.style.display = "none";
    this.stopReacting();
  };

  private hate = (): void => {
    this.switcher.show(() => {
      this.hateButton.style.display = "none";
      this.hatedButton.style.display = "block";
      this.reaction = TaleReaction.HATE;
      this.timeoutHandle = this.window.setTimeout(
        () => this.reactAndDelete(),
        QuickTaleCard.DELETE_DELAY
      );
    }, this.unhate);
  };

  private unhate = (): void => {
    this.hateButton.style.display = "block";
    this.hatedButton.style.display = "none";
    this.stopReacting();
  };

  public dismiss = (): void => {
    this.reaction = TaleReaction.DISMISS;
    this.reactAndDelete();
  };
}
