import smallImage = require("./test_data/small.jpg");
import tallImage = require("./test_data/tall.webp");
import userImage = require("./test_data/user_image.jpg");
import wideImage = require("./test_data/wide.png");
import { TaleReaction } from "../../../../interface/tale_reaction";
import { REACT_TO_TALE_REQUEST_BODY } from "../../../../interface/tale_service";
import { normalizeBody } from "../../common/normalize_body";
import { QuickTaleCard } from "./quick_tale_card";
import { E } from "@selfage/element/factory";
import { eqMessage } from "@selfage/message/test_matcher";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

class RenderCase implements TestCase {
  private container: HTMLDivElement;
  public constructor(
    public name: string,
    private text: string | undefined,
    private images: Array<string>,
    private screenshotPath: string,
    private screenshotGoldenPath: string,
    private screenshotDiffPath: string
  ) {}
  public async execute() {
    // Prepare
    let cut = new QuickTaleCard(
      {
        avatarSmallPath: userImage,
        username: "some-name",
        userNatureName: "Some Name",
        createdTimestamp: Date.parse("2022-10-11"),
        quickLayoutTale: {
          text: this.text,
          images: this.images,
        },
      },
      undefined,
      undefined
    );
    this.container = E.div({}, cut.body);
    document.body.style.width = "800px";

    // Execute
    document.body.appendChild(this.container);
    if (this.images.length > 0) {
      await new Promise<void>((resolve) => cut.once("load", resolve));
    }

    // Verify
    await asyncAssertScreenshot(
      this.screenshotPath,
      this.screenshotGoldenPath,
      this.screenshotDiffPath,
      { fullPage: true }
    );
  }
  public tearDown() {
    this.container.remove();
  }
}

class ReactionAndDeleteCase implements TestCase {
  private container: HTMLDivElement;
  public constructor(
    public name: string,
    private buttonSelector: string,
    private reaction: TaleReaction
  ) {}
  public async execute() {
    // Prepare
    let webServiceClientMock = new (class extends WebServiceClient {
      public constructor() {
        super(undefined, undefined);
      }
    })();
    let windowMock = new (class {
      public callback: Function;
      setTimeout(callback: Function) {
        this.callback = callback;
        return 0;
      }
    })();
    let cut = new QuickTaleCard(
      {
        taleId: "id1",
        avatarSmallPath: userImage,
        username: "some-name",
        userNatureName: "Some Name",
        createdTimestamp: Date.parse("2022-10-11"),
        quickLayoutTale: {
          text: "blahblahblahblah\nsomethingsomething",
        },
      },
      webServiceClientMock,
      windowMock as any
    );
    this.container = E.div({}, cut.body);
    let actionsExpandButton = this.container.querySelector(
      ".quick-tale-card-actions-expand-button"
    ) as HTMLDivElement;
    let reactionButton = this.container.querySelector(
      this.buttonSelector
    ) as HTMLDivElement;
    document.body.style.width = "800px";
    document.body.appendChild(this.container);
    document.body.clientHeight; // Force reflow
    // Expand actions
    actionsExpandButton.click();
    await new Promise<void>((resolve) =>
      cut.once("actionsLineTranstionEnd", resolve)
    );
    // Reacting
    reactionButton.click();

    // Prepare
    let requestCaptured: any;
    webServiceClientMock.send = (request) => {
      requestCaptured = request;
      return {} as any;
    };

    // Execute
    windowMock.callback();
    await new Promise<void>((resolve) => cut.once("delete", resolve));

    // Verify
    assertThat(
      requestCaptured.request.body,
      eqMessage(
        { taleId: "id1", reaction: this.reaction },
        REACT_TO_TALE_REQUEST_BODY
      ),
      "request"
    );
    assertThat(this.container.childElementCount, eq(0), "deleted");
  }
  public tearDown() {
    this.container.remove();
  }
}

class UndoReactionCase implements TestCase {
  private container: HTMLDivElement;
  public constructor(
    public name: string,
    private buttonSelector: string,
    private undoButtonSelector: string,
    private screenshotPath: string,
    private screenshotBaselinePath: string,
    private screenshotDiffPath: string
  ) {}
  public async execute() {
    // Prepare
    let windowMock = new (class {
      public timeoutHandle = 0;
      public clearedTimeoutHandler: number;
      setTimeout() {
        this.timeoutHandle += 1;
        return this.timeoutHandle;
      }
      clearTimeout(timeoutHandle: number) {
        this.clearedTimeoutHandler = timeoutHandle;
      }
    })();
    let cut = new QuickTaleCard(
      {
        taleId: "id1",
        avatarSmallPath: userImage,
        username: "some-name",
        userNatureName: "Some Name",
        createdTimestamp: Date.parse("2022-10-11"),
        quickLayoutTale: {
          text: "blahblahblahblah\nsomethingsomething",
        },
      },
      undefined,
      windowMock as any
    );
    this.container = E.div({}, cut.body);
    let actionsExpandButton = this.container.querySelector(
      ".quick-tale-card-actions-expand-button"
    ) as HTMLDivElement;
    let reactionButton = this.container.querySelector(
      this.buttonSelector
    ) as HTMLDivElement;
    let undoReactionButton = this.container.querySelector(
      this.undoButtonSelector
    ) as HTMLDivElement;
    document.body.style.width = "800px";
    document.body.appendChild(this.container);
    document.body.clientHeight; // Force reflow
    // Expand actions
    actionsExpandButton.click();
    await new Promise<void>((resolve) =>
      cut.once("actionsLineTranstionEnd", resolve)
    );
    await puppeteerScreenshot(this.screenshotBaselinePath, { fullPage: true });
    reactionButton.click();

    // Execute
    undoReactionButton.click();

    // Verify
    assertThat(windowMock.clearedTimeoutHandler, eq(1), "cleared");
    await asyncAssertScreenshot(
      this.screenshotPath,
      this.screenshotBaselinePath,
      this.screenshotDiffPath,
      { fullPage: true }
    );
    await puppeteerDeleteFile(this.screenshotBaselinePath);
  }
  public tearDown() {
    this.container.remove();
  }
}

TEST_RUNNER.run({
  name: "QuickTaleCardTest",
  cases: [
    new RenderCase(
      "RenderOneWideImage",
      undefined,
      [wideImage],
      __dirname + "/quick_tale_card_render_one_wide_image.png",
      __dirname + "/golden/quick_tale_card_render_one_wide_image.png",
      __dirname + "/quick_tale_card_render_one_wide_image_diff.png"
    ),
    new RenderCase(
      "RenderOneTallImage",
      undefined,
      [tallImage],
      __dirname + "/quick_tale_card_render_one_tall_image.png",
      __dirname + "/golden/quick_tale_card_render_one_tall_image.png",
      __dirname + "/quick_tale_card_render_one_tall_image_diff.png"
    ),
    new RenderCase(
      "RenderOneSmallImageOnly",
      "blahblahblahblah\nsomethingsomething",
      [smallImage],
      __dirname + "/quick_tale_card_render_one_small_image_with_text.png",
      __dirname +
        "/golden/quick_tale_card_render_one_small_image_with_text.png",
      __dirname + "/quick_tale_card_render_one_small_image_with_text_diff.png"
    ),
    new RenderCase(
      "RenderFourImages",
      undefined,
      [smallImage, tallImage, wideImage, userImage],
      __dirname + "/quick_tale_card_render_4_images.png",
      __dirname + "/golden/quick_tale_card_render_4_images.png",
      __dirname + "/quick_tale_card_render_4_images_diff.png"
    ),
    new (class implements TestCase {
      public name = "ViewOneImage";
      public async execute() {
        // Prepare
        let cut = new QuickTaleCard(
          {
            avatarSmallPath: userImage,
            username: "some-name",
            userNatureName: "Some Name",
            createdTimestamp: Date.parse("2022-10-11"),
            quickLayoutTale: {
              images: [smallImage],
            },
          },
          undefined,
          undefined
        );
        let imageUrlsCaptured: Array<string>;
        let indexCaptured: number;
        cut.on("imageViewer", (imageUrls, index) => {
          imageUrlsCaptured = imageUrls;
          indexCaptured = index;
        });
        let imageElement = cut.body.querySelector("img") as HTMLElement;

        // Execute
        imageElement.click();

        // Verify
        assertThat(imageUrlsCaptured, eqArray([eq(smallImage)]), "image URLs");
        assertThat(indexCaptured, eq(0), "index");
      }
    })(),
    new (class implements TestCase {
      public name = "ViewImages";
      public async execute() {
        // Prepare
        let cut = new QuickTaleCard(
          {
            avatarSmallPath: userImage,
            username: "some-name",
            userNatureName: "Some Name",
            createdTimestamp: Date.parse("2022-10-11"),
            quickLayoutTale: {
              images: [smallImage, tallImage, wideImage],
            },
          },
          undefined,
          undefined
        );
        let imageUrlsCaptured: Array<string>;
        let indexCaptured: number;
        cut.on("imageViewer", (imageUrls, index) => {
          imageUrlsCaptured = imageUrls;
          indexCaptured = index;
        });
        let imageElements = cut.body.querySelectorAll("img");
        let expectedImageUrls = [eq(smallImage), eq(tallImage), eq(wideImage)];

        // Execute
        (imageElements[0] as HTMLElement).click();

        // Verify
        assertThat(
          imageUrlsCaptured,
          eqArray(expectedImageUrls),
          "image URLs 0"
        );
        assertThat(indexCaptured, eq(0), "index");

        // Execute
        (imageElements[1] as HTMLElement).click();

        // Verify
        assertThat(
          imageUrlsCaptured,
          eqArray(expectedImageUrls),
          "image URLs 1"
        );
        assertThat(indexCaptured, eq(1), "index");

        // Execute
        (imageElements[2] as HTMLElement).click();

        // Verify
        assertThat(
          imageUrlsCaptured,
          eqArray(expectedImageUrls),
          "image URLs 2"
        );
        assertThat(indexCaptured, eq(2), "index");
      }
    })(),
    new RenderCase(
      "RenderTextOnly",
      "blahblahblahblah\nsomethingsomething\n3rdline\n4thline",
      [],
      __dirname + "/quick_tale_card_render_text_only.png",
      __dirname + "/golden/quick_tale_card_render_text_only.png",
      __dirname + "/quick_tale_card_render_text_only_diff.png"
    ),
    new (class implements TestCase {
      public name = "MultiLinesText";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new QuickTaleCard(
          {
            avatarSmallPath: userImage,
            username: "some-name",
            userNatureName: "Some Name",
            createdTimestamp: Date.parse("2022-10-11"),
            quickLayoutTale: {
              text: "hahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\n",
            },
          },
          undefined,
          undefined
        );
        this.container = E.div({}, cut.body);
        let showMoreButton = this.container.querySelector(
          ".quick-tale-card-text-content-show-more-button"
        ) as HTMLDivElement;
        let showLessButton = this.container.querySelector(
          ".quick-tale-card-text-content-show-less-button"
        ) as HTMLDivElement;
        document.body.style.width = "800px";

        // Execute
        document.body.appendChild(this.container);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_show_3_lines.png",
          __dirname + "/golden/quick_tale_card_show_3_lines.png",
          __dirname + "/quick_tale_card_show_3_lines_diff.png",
          { fullPage: true }
        );

        // Execute
        showMoreButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_show_more_lines.png",
          __dirname + "/golden/quick_tale_card_show_more_lines.png",
          __dirname + "/quick_tale_card_show_more_lines_diff.png",
          { fullPage: true }
        );

        // Execute
        showLessButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_show_3_lines.png",
          __dirname + "/golden/quick_tale_card_show_3_lines.png",
          __dirname + "/quick_tale_card_show_3_lines_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "RenderActionsLine";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new QuickTaleCard(
          {
            avatarSmallPath: userImage,
            username: "some-name",
            userNatureName: "Some Name",
            createdTimestamp: Date.parse("2022-10-11"),
            quickLayoutTale: {
              text: "blahblahblahblah\nsomethingsomething",
            },
          },
          undefined,
          undefined
        );
        this.container = E.div({}, cut.body);
        let actionsExpandButton = this.container.querySelector(
          ".quick-tale-card-actions-expand-button"
        ) as HTMLDivElement;
        let collapseButton = this.container.querySelector(
          ".quick-tale-card-collapse-button"
        ) as HTMLDivElement;
        document.body.style.width = "800px";
        document.body.appendChild(this.container);
        await puppeteerScreenshot(
          __dirname + "/quick_tale_card_render_no_actions_baseline.png",
          { fullPage: true }
        );

        // Execute
        actionsExpandButton.click();
        await new Promise<void>((resolve) => {
          cut.once("actionsLineTranstionEnd", resolve);
        });

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_actions_expanded.png",
          __dirname + "/golden/quick_tale_card_actions_expanded.png",
          __dirname + "/quick_tale_card_actions_expanded_diff.png",
          { fullPage: true }
        );

        // Execute
        collapseButton.click();
        await new Promise<void>((resolve) => {
          cut.once("actionsLineTranstionEnd", resolve);
        });

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_actions_collapsed.png",
          __dirname + "/quick_tale_card_render_no_actions_baseline.png",
          __dirname + "/quick_tale_card_actions_collapsed_diff.png",
          { fullPage: true }
        );
        await puppeteerDeleteFile(
          __dirname + "/quick_tale_card_render_no_actions_baseline.png"
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "SwitchReactions";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let windowMock = new (class {
          public timeoutHandle = 0;
          public clearedTimeoutHandler: number;
          setTimeout() {
            this.timeoutHandle += 1;
            return this.timeoutHandle;
          }
          clearTimeout(timeoutHandle: number) {
            this.clearedTimeoutHandler = timeoutHandle;
          }
        })();
        let cut = new QuickTaleCard(
          {
            avatarSmallPath: userImage,
            username: "some-name",
            userNatureName: "Some Name",
            createdTimestamp: Date.parse("2022-10-11"),
            quickLayoutTale: {
              text: "blahblahblahblah\nsomethingsomething",
            },
          },
          undefined,
          windowMock as any
        );
        this.container = E.div({}, cut.body);
        let actionsExpandButton = this.container.querySelector(
          ".quick-tale-card-actions-expand-button"
        ) as HTMLDivElement;
        let loveButton = this.container.querySelector(
          ".quick-tale-card-love-button"
        ) as HTMLDivElement;
        let likeButton = this.container.querySelector(
          ".quick-tale-card-like-button"
        ) as HTMLDivElement;
        let dislikeButton = this.container.querySelector(
          ".quick-tale-card-dislike-button"
        ) as HTMLDivElement;
        let hateButton = this.container.querySelector(
          ".quick-tale-card-hate-button"
        ) as HTMLDivElement;
        document.body.style.width = "800px";
        document.body.appendChild(this.container);
        document.body.clientHeight; // Force reflow.
        actionsExpandButton.click();
        await new Promise<void>((resolve) =>
          cut.once("actionsLineTranstionEnd", resolve)
        );

        // Execute
        loveButton.click();

        // Verify
        assertThat(windowMock.timeoutHandle, eq(1), "love");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_loved.png",
          __dirname + "/golden/quick_tale_card_loved.png",
          __dirname + "/quick_tale_card_loved_diff.png",
          { fullPage: true }
        );

        // Execute
        likeButton.click();

        // Verify
        assertThat(windowMock.clearedTimeoutHandler, eq(1), "cleared love");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_liked.png",
          __dirname + "/golden/quick_tale_card_liked.png",
          __dirname + "/quick_tale_card_liked_diff.png",
          { fullPage: true }
        );

        // Execute
        dislikeButton.click();

        // Verify
        assertThat(windowMock.clearedTimeoutHandler, eq(2), "cleared liked");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_disliked.png",
          __dirname + "/golden/quick_tale_card_disliked.png",
          __dirname + "/quick_tale_card_disliked_diff.png",
          { fullPage: true }
        );

        // Execute
        hateButton.click();

        // Verify
        assertThat(windowMock.clearedTimeoutHandler, eq(3), "cleared disliked");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_hated.png",
          __dirname + "/golden/quick_tale_card_hated.png",
          __dirname + "/quick_tale_card_hated_diff.png",
          { fullPage: true }
        );

        // Execute
        loveButton.click();

        // Verify
        assertThat(windowMock.clearedTimeoutHandler, eq(4), "cleared hated");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_loved.png",
          __dirname + "/golden/quick_tale_card_loved.png",
          __dirname + "/quick_tale_card_loved_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new UndoReactionCase(
      "UndoLove",
      ".quick-tale-card-love-button",
      ".quick-tale-card-loved-button",
      __dirname + "/quick_tale_card_undo_love.png",
      __dirname + "/quick_tale_card_undo_love_baseline.png",
      __dirname + "/quick_tale_card_undo_love_diff.png"
    ),
    new UndoReactionCase(
      "UndoLike",
      ".quick-tale-card-like-button",
      ".quick-tale-card-liked-button",
      __dirname + "/quick_tale_card_undo_like.png",
      __dirname + "/quick_tale_card_undo_like_baseline.png",
      __dirname + "/quick_tale_card_undo_like_diff.png"
    ),
    new UndoReactionCase(
      "UndoDislike",
      ".quick-tale-card-dislike-button",
      ".quick-tale-card-disliked-button",
      __dirname + "/quick_tale_card_undo_dislike.png",
      __dirname + "/quick_tale_card_undo_dislike_baseline.png",
      __dirname + "/quick_tale_card_undo_dislike_diff.png"
    ),
    new UndoReactionCase(
      "UndoHate",
      ".quick-tale-card-hate-button",
      ".quick-tale-card-hated-button",
      __dirname + "/quick_tale_card_undo_hate.png",
      __dirname + "/quick_tale_card_undo_hate_baseline.png",
      __dirname + "/quick_tale_card_undo_hate_diff.png"
    ),
    new ReactionAndDeleteCase(
      "LoveAndDelete",
      ".quick-tale-card-love-button",
      TaleReaction.LOVE
    ),
    new ReactionAndDeleteCase(
      "LikeAndDelete",
      ".quick-tale-card-like-button",
      TaleReaction.LIKE
    ),
    new ReactionAndDeleteCase(
      "DislikeAndDelete",
      ".quick-tale-card-dislike-button",
      TaleReaction.DISLIKE
    ),
    new ReactionAndDeleteCase(
      "HateAndDelete",
      ".quick-tale-card-hate-button",
      TaleReaction.HATE
    ),
    new (class implements TestCase {
      public name = "Dismiss";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let webServiceClientMock = new (class extends WebServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
        })();
        let cut = new QuickTaleCard(
          {
            taleId: "id1",
            avatarSmallPath: userImage,
            username: "some-name",
            userNatureName: "Some Name",
            createdTimestamp: Date.parse("2022-10-11"),
            quickLayoutTale: {
              text: "blahblahblahblah\nsomethingsomething",
            },
          },
          webServiceClientMock,
          undefined
        );
        this.container = E.div({}, cut.body);
        let actionsExpandButton = this.container.querySelector(
          ".quick-tale-card-actions-expand-button"
        ) as HTMLDivElement;
        let dismissButton = this.container.querySelector(
          ".quick-tale-card-dismiss-button"
        ) as HTMLDivElement;
        document.body.style.width = "800px";
        document.body.appendChild(this.container);
        document.body.clientHeight; // Force reflow.
        // Expand actions.
        actionsExpandButton.click();
        await new Promise<void>((resolve) =>
          cut.once("actionsLineTranstionEnd", resolve)
        );
        let requestCaptured: any;
        webServiceClientMock.send = (request) => {
          requestCaptured = request;
          return {} as any;
        };

        // Execute
        dismissButton.click();
        await new Promise<void>((resolve) => cut.once("delete", resolve));

        // Verify
        assertThat(
          requestCaptured.request.body,
          eqMessage(
            { taleId: "id1", reaction: TaleReaction.DISMISS },
            REACT_TO_TALE_REQUEST_BODY
          ),
          "request"
        );
        assertThat(this.container.childElementCount, eq(0), "deleted");
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
