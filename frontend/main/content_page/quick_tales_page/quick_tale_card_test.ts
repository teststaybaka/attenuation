import smallImage = require("./test_data/small.jpg");
import tallImage = require("./test_data/tall.webp");
import userImage = require("./test_data/user_image.jpg");
import wideImage = require("./test_data/wide.png");
import { TaleReaction } from "../../../../interface/tale_reaction";
import { REACT_TO_TALE_REQUEST_BODY } from "../../../../interface/tale_service";
import { IconButton } from "../../common/icon_button";
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
    let cut = new QuickTaleCard(undefined, undefined, {
      avatarSmallPath: userImage,
      username: "some-name",
      userNatureName: "Some Name",
      createdTimestamp: Date.parse("2022-10-11"),
      quickLayoutTale: {
        text: this.text,
        images: this.images,
      },
    });
    this.container = E.div({}, cut.body);
    document.body.style.width = "800px";

    // Execute
    document.body.appendChild(this.container);
    if (this.images.length > 0) {
      await new Promise<void>((resolve) => cut.once("imagesLoaded", resolve));
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
    private getReactionButtonFn: (cut: QuickTaleCard) => IconButton,
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
    let cut = new QuickTaleCard(webServiceClientMock, windowMock as any, {
      taleId: "id1",
      avatarSmallPath: userImage,
      username: "some-name",
      userNatureName: "Some Name",
      createdTimestamp: Date.parse("2022-10-11"),
      quickLayoutTale: {
        text: "blahblahblahblah\nsomethingsomething",
      },
    });
    this.container = E.div({}, cut.body);
    document.body.style.width = "800px";
    document.body.appendChild(this.container);
    document.body.clientHeight; // Force reflow
    // Expand actions
    cut.actionsExpandButton.click();
    await new Promise<void>((resolve) =>
      cut.once("actionsLineTranstionEnded", resolve)
    );
    // Reacting
    this.getReactionButtonFn(cut).click();

    // Prepare
    let requestCaptured: any;
    webServiceClientMock.send = (request) => {
      requestCaptured = request;
      return {} as any;
    };

    // Execute
    windowMock.callback();
    await new Promise<void>((resolve) => cut.once("deleted", resolve));

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
    private getReactionButtonFn: (cut: QuickTaleCard) => IconButton,
    private getUndoReactionButtonFn: (cut: QuickTaleCard) => IconButton,
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
    let cut = new QuickTaleCard(undefined, windowMock as any, {
      taleId: "id1",
      avatarSmallPath: userImage,
      username: "some-name",
      userNatureName: "Some Name",
      createdTimestamp: Date.parse("2022-10-11"),
      quickLayoutTale: {
        text: "blahblahblahblah\nsomethingsomething",
      },
    });
    this.container = E.div({}, cut.body);
    document.body.style.width = "800px";
    document.body.appendChild(this.container);
    document.body.clientHeight; // Force reflow
    // Expand actions
    cut.actionsExpandButton.click();
    await new Promise<void>((resolve) =>
      cut.once("actionsLineTranstionEnded", resolve)
    );
    await puppeteerScreenshot(this.screenshotBaselinePath, { fullPage: true });
    this.getReactionButtonFn(cut).click();

    // Execute
    this.getUndoReactionButtonFn(cut).click();

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
        let cut = new QuickTaleCard(undefined, undefined, {
          avatarSmallPath: userImage,
          username: "some-name",
          userNatureName: "Some Name",
          createdTimestamp: Date.parse("2022-10-11"),
          quickLayoutTale: {
            images: [smallImage],
          },
        });
        let imageUrlsCaptured: Array<string>;
        let indexCaptured: number;
        cut.on("viewImages", (imageUrls, index) => {
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
        let cut = new QuickTaleCard(undefined, undefined, {
          avatarSmallPath: userImage,
          username: "some-name",
          userNatureName: "Some Name",
          createdTimestamp: Date.parse("2022-10-11"),
          quickLayoutTale: {
            images: [smallImage, tallImage, wideImage],
          },
        });
        let imageUrlsCaptured: Array<string>;
        let indexCaptured: number;
        cut.on("viewImages", (imageUrls, index) => {
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
        let cut = new QuickTaleCard(undefined, undefined, {
          avatarSmallPath: userImage,
          username: "some-name",
          userNatureName: "Some Name",
          createdTimestamp: Date.parse("2022-10-11"),
          quickLayoutTale: {
            text: "hahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\nhahah\n",
          },
        });
        this.container = E.div({}, cut.body);
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
        cut.showMoreButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_show_more_lines.png",
          __dirname + "/golden/quick_tale_card_show_more_lines.png",
          __dirname + "/quick_tale_card_show_more_lines_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.showLessButton.click();

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
        let cut = new QuickTaleCard(undefined, undefined, {
          avatarSmallPath: userImage,
          username: "some-name",
          userNatureName: "Some Name",
          createdTimestamp: Date.parse("2022-10-11"),
          quickLayoutTale: {
            text: "blahblahblahblah\nsomethingsomething",
          },
        });
        this.container = E.div({}, cut.body);
        document.body.style.width = "800px";
        document.body.appendChild(this.container);
        await puppeteerScreenshot(
          __dirname + "/quick_tale_card_render_no_actions_baseline.png",
          { fullPage: true }
        );

        // Execute
        cut.actionsExpandButton.click();
        await new Promise<void>((resolve) => {
          cut.once("actionsLineTranstionEnded", resolve);
        });

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_actions_expanded.png",
          __dirname + "/golden/quick_tale_card_actions_expanded.png",
          __dirname + "/quick_tale_card_actions_expanded_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.actionsCollapseButton.click();
        await new Promise<void>((resolve) => {
          cut.once("actionsLineTranstionEnded", resolve);
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
        let cut = new QuickTaleCard(undefined, windowMock as any, {
          avatarSmallPath: userImage,
          username: "some-name",
          userNatureName: "Some Name",
          createdTimestamp: Date.parse("2022-10-11"),
          quickLayoutTale: {
            text: "blahblahblahblah\nsomethingsomething",
          },
        });
        this.container = E.div({}, cut.body);
        document.body.style.width = "800px";
        document.body.appendChild(this.container);
        document.body.clientHeight; // Force reflow.
        cut.actionsExpandButton.click();
        await new Promise<void>((resolve) =>
          cut.once("actionsLineTranstionEnded", resolve)
        );

        // Execute
        cut.loveButton.click();

        // Verify
        assertThat(windowMock.timeoutHandle, eq(1), "love");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_loved.png",
          __dirname + "/golden/quick_tale_card_loved.png",
          __dirname + "/quick_tale_card_loved_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.likeButton.click();

        // Verify
        assertThat(windowMock.clearedTimeoutHandler, eq(1), "cleared love");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_liked.png",
          __dirname + "/golden/quick_tale_card_liked.png",
          __dirname + "/quick_tale_card_liked_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.dislikeButton.click();

        // Verify
        assertThat(windowMock.clearedTimeoutHandler, eq(2), "cleared liked");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_disliked.png",
          __dirname + "/golden/quick_tale_card_disliked.png",
          __dirname + "/quick_tale_card_disliked_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.hateButton.click();

        // Verify
        assertThat(windowMock.clearedTimeoutHandler, eq(3), "cleared disliked");
        await asyncAssertScreenshot(
          __dirname + "/quick_tale_card_hated.png",
          __dirname + "/golden/quick_tale_card_hated.png",
          __dirname + "/quick_tale_card_hated_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.loveButton.click();

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
      (cut) => cut.loveButton,
      (cut) => cut.lovedButton,
      __dirname + "/quick_tale_card_undo_love.png",
      __dirname + "/quick_tale_card_undo_love_baseline.png",
      __dirname + "/quick_tale_card_undo_love_diff.png"
    ),
    new UndoReactionCase(
      "UndoLike",
      (cut) => cut.likeButton,
      (cut) => cut.likedButton,
      __dirname + "/quick_tale_card_undo_like.png",
      __dirname + "/quick_tale_card_undo_like_baseline.png",
      __dirname + "/quick_tale_card_undo_like_diff.png"
    ),
    new UndoReactionCase(
      "UndoDislike",
      (cut) => cut.dislikeButton,
      (cut) => cut.dislikedButton,
      __dirname + "/quick_tale_card_undo_dislike.png",
      __dirname + "/quick_tale_card_undo_dislike_baseline.png",
      __dirname + "/quick_tale_card_undo_dislike_diff.png"
    ),
    new UndoReactionCase(
      "UndoHate",
      (cut) => cut.hateButton,
      (cut) => cut.hatedButton,
      __dirname + "/quick_tale_card_undo_hate.png",
      __dirname + "/quick_tale_card_undo_hate_baseline.png",
      __dirname + "/quick_tale_card_undo_hate_diff.png"
    ),
    new ReactionAndDeleteCase(
      "LoveAndDelete",
      (cut) => cut.loveButton,
      TaleReaction.LOVE
    ),
    new ReactionAndDeleteCase(
      "LikeAndDelete",
      (cut) => cut.likeButton,
      TaleReaction.LIKE
    ),
    new ReactionAndDeleteCase(
      "DislikeAndDelete",
      (cut) => cut.dislikeButton,
      TaleReaction.DISLIKE
    ),
    new ReactionAndDeleteCase(
      "HateAndDelete",
      (cut) => cut.hateButton,
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
        let cut = new QuickTaleCard(webServiceClientMock, undefined, {
          taleId: "id1",
          avatarSmallPath: userImage,
          username: "some-name",
          userNatureName: "Some Name",
          createdTimestamp: Date.parse("2022-10-11"),
          quickLayoutTale: {
            text: "blahblahblahblah\nsomethingsomething",
          },
        });
        this.container = E.div({}, cut.body);
        document.body.style.width = "800px";
        document.body.appendChild(this.container);
        document.body.clientHeight; // Force reflow.
        // Expand actions.
        cut.actionsExpandButton.click();
        await new Promise<void>((resolve) =>
          cut.once("actionsLineTranstionEnded", resolve)
        );
        let requestCaptured: any;
        webServiceClientMock.send = (request) => {
          requestCaptured = request;
          return {} as any;
        };

        // Execute
        cut.dismissButton.click();
        await new Promise<void>((resolve) => cut.once("deleted", resolve));

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
