import wideImage = require("./test_data/wide.jpeg");
import tallImage = require("./test_data/tall.webp");
import { normalizeBody } from "../../../common/normalize_body";
import { ImageViewer } from "./image_viewer";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "ImageViewerTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderAndScroll";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(1000, 400);
        let cut = new ImageViewer(wideImage, true);
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.controllerBody
          ),
          cut.body
        );

        // Execute
        document.body.appendChild(this.container);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_render.png",
          __dirname + "/golden/image_viewer_render.png",
          __dirname + "/image_viewer_render_diff.png"
        );

        // Execute
        await puppeteerSetViewport(400, 400);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_shrink_viewport.png",
          __dirname + "/golden/image_viewer_shrink_viewport.png",
          __dirname + "/image_viewer_shrink_viewport_diff.png"
        );

        // Execute
        window.scrollTo(400, 0);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_scroll_to_right.png",
          __dirname + "/golden/image_viewer_scroll_to_right.png",
          __dirname + "/image_viewer_scroll_to_right_diff.png"
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "RenderTall";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(400, 400);
        let cut = new ImageViewer(tallImage, true);
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.controllerBody
          ),
          cut.body
        );

        // Execute
        document.body.appendChild(this.container);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_render_tall.png",
          __dirname + "/golden/image_viewer_render_tall.png",
          __dirname + "/image_viewer_render_tall_diff.png"
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "ZoomInAndOut";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(1000, 400);
        let cut = new ImageViewer(wideImage, true);
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.controllerBody
          ),
          cut.body
        );
        let fitButton = this.container.querySelector(
          ".image-viewer-zoom-fit-button"
        ) as HTMLDivElement;
        let zoomInButton = this.container.querySelector(
          ".image-viewer-zoom-in-button"
        ) as HTMLDivElement;
        let zoomOutButton = this.container.querySelector(
          ".image-viewer-zoom-out-button"
        ) as HTMLDivElement;

        // Execute
        document.body.appendChild(this.container);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_render.png",
          __dirname + "/golden/image_viewer_render.png",
          __dirname + "/image_viewer_render_diff.png"
        );

        // Prepare
        await puppeteerSetViewport(400, 400);

        // Execute
        fitButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_shrink_and_fit.png",
          __dirname + "/golden/image_viewer_shrink_and_fit.png",
          __dirname + "/image_viewer_shrink_and_fit_diff.png"
        );

        // Execute
        zoomInButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_zoom_in.png",
          __dirname + "/golden/image_viewer_zoom_in.png",
          __dirname + "/image_viewer_zoom_in_diff.png"
        );

        // Execute
        zoomInButton.click();
        zoomInButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_zoom_in_more.png",
          __dirname + "/golden/image_viewer_zoom_in_more.png",
          __dirname + "/image_viewer_zoom_in_more_diff.png"
        );

        // Execute
        zoomOutButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_zoom_out.png",
          __dirname + "/golden/image_viewer_zoom_out.png",
          __dirname + "/image_viewer_zoom_out_diff.png"
        );

        // Execute
        zoomOutButton.click();
        zoomOutButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_zoom_out_more.png",
          __dirname + "/golden/image_viewer_zoom_out_more.png",
          __dirname + "/image_viewer_zoom_out_more_diff.png"
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "ZoomInAndScroll";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new ImageViewer(wideImage, true);
        await new Promise<void>((resolve) => cut.on("load", resolve));
        await puppeteerSetViewport(400, 400);
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.controllerBody
          ),
          cut.body
        );
        document.body.appendChild(this.container);
        let zoomInButton = this.container.querySelector(
          ".image-viewer-zoom-in-button"
        ) as HTMLDivElement;

        zoomInButton.click();
        zoomInButton.click();

        // Execute
        window.scrollTo(150, 100);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_zoom_in_and_scroll.png",
          __dirname + "/golden/image_viewer_zoom_in_and_scroll.png",
          __dirname + "/image_viewer_zoom_in_and_scroll_diff.png"
        );

        // Execute
        zoomInButton.click();
        zoomInButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/image_viewer_scroll_then_zoom_in.png",
          __dirname + "/golden/image_viewer_scroll_then_zoom_in.png",
          __dirname + "/image_viewer_scroll_then_zoom_in_diff.png"
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
