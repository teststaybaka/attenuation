import sampleImage = require("./test_data/sample.jpg");
import tallImage = require("./test_data/tall.webp");
import wideImage = require("./test_data/wide.jpeg");
import { normalizeBody } from "../../../common/normalize_body";
import { createBackMenuIcon } from "../../common/menu_items";
import { MenuItemMock } from "../../common/mocks";
import { ImageViewer } from "./image_viewer";
import { ImagesViewerPage } from "./images_viewer_page";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "ImagesViewerPageTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderAndNavigate";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(400, 400);
        let cut = new ImagesViewerPage(
          new MenuItemMock(createBackMenuIcon(), "Back"),
          ImageViewer.create
        );
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.menuBody
          ),
          E.div(
            {
              style: `position: fixed; right: 0;`,
            },
            ...cut.controllerBodies
          ),
          cut.body
        );
        document.body.append(this.container);
        let downButton = this.container.querySelector(
          ".images-viewer-down-button"
        ) as HTMLDivElement;
        let upButton = this.container.querySelector(
          ".images-viewer-up-button"
        ) as HTMLDivElement;

        // Execute
        await cut.show([wideImage, tallImage, sampleImage], 0);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/images_viewer_page_render.png",
          __dirname + "/golden/images_viewer_page_render.png",
          __dirname + "/images_viewer_page_render_diff.png"
        );

        // Execute
        downButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/images_viewer_page_next.png",
          __dirname + "/golden/images_viewer_page_next.png",
          __dirname + "/images_viewer_page_next_diff.png"
        );

        // Execute
        downButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/images_viewer_page_last.png",
          __dirname + "/golden/images_viewer_page_last.png",
          __dirname + "/images_viewer_page_last_diff.png"
        );

        // Execute
        upButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/images_viewer_page_previous.png",
          __dirname + "/golden/images_viewer_page_previous.png",
          __dirname + "/images_viewer_page_previous_diff.png"
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "RenderAndHideAndShow";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(400, 400);
        let cut = new ImagesViewerPage(
          new MenuItemMock(createBackMenuIcon(), "Back"),
          ImageViewer.create
        );
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.menuBody
          ),
          E.div(
            {
              style: `position: fixed; right: 0;`,
            },
            ...cut.controllerBodies
          ),
          cut.body
        );
        document.body.append(this.container);

        // Execute
        await cut.show([wideImage, tallImage, sampleImage], 1);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/images_viewer_page_render_the_second.png",
          __dirname + "/golden/images_viewer_page_render_the_second.png",
          __dirname + "/images_viewer_page_render_the_second_diff.png"
        );

        // Execute
        cut.hide();
        await cut.show([sampleImage], 0);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/images_viewer_page_show_after_hide.png",
          __dirname + "/golden/images_viewer_page_show_after_hide.png",
          __dirname + "/images_viewer_page_show_after_hide_diff.png"
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "Back";
      public async execute() {
        // Prepare
        let backButton = new MenuItemMock(createBackMenuIcon(), "Back");
        let cut = new ImagesViewerPage(backButton, ImageViewer.create);
        let goBack = false;
        cut.on("back", () => (goBack = true));

        // Execute
        backButton.click();

        // Verify
        assertThat(goBack, eq(true), `Go back`);
      }
    })(),
  ],
});
