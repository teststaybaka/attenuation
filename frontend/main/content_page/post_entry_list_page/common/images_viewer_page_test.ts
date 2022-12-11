import sampleImage = require("./test_data/sample.jpg");
import tallImage = require("./test_data/tall.webp");
import wideImage = require("./test_data/wide.jpeg");
import { ImageViewer } from "./image_viewer";
import { ImagesViewerPage } from "./images_viewer_page";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { normalizeBody } from "../../../common/normalize_body";

normalizeBody();

TEST_RUNNER.run({
  name: "ImagesViewerPageTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderAndDownAndUp";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(400, 400);
        let cut = new ImagesViewerPage(
          [wideImage, tallImage, sampleImage],
          0,
          ImageViewer.create
        );
        await new Promise<void>((resolve) => cut.on("load", resolve));
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            ...cut.menuBodies
          ),
          E.div(
            {
              style: `position: fixed; right: 0;`,
            },
            ...cut.controllerBodies
          ),
          E.div({}, ...cut.bodies)
        );
        let downButton = this.container.querySelector('.images-viewer-down-button') as HTMLDivElement;
        let upButton = this.container.querySelector('.images-viewer-up-button') as HTMLDivElement;

        // Execute
        document.body.appendChild(this.container);

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
      public name = "RenderTheSecond";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(400, 400);
        let cut = new ImagesViewerPage(
          [wideImage, tallImage, sampleImage],
          1,
          ImageViewer.create
        );
        await new Promise<void>((resolve) => cut.on("load", resolve));
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            ...cut.menuBodies
          ),
          E.div(
            {
              style: `position: fixed; right: 0;`,
            },
            ...cut.controllerBodies
          ),
          E.div({}, ...cut.bodies)
        );

        // Execute
        document.body.appendChild(this.container);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/images_viewer_page_render_the_second.png",
          __dirname + "/golden/images_viewer_page_render_the_second.png",
          __dirname + "/images_viewer_page_render_the_second_diff.png"
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
