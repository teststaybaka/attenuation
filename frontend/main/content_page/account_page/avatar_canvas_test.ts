import { normalizeBody } from "../../common/normalize_body";
import { AvatarCanvas } from "./avatar_canvas";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "AvatarCanvasTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderAndResize";
      private cut: AvatarCanvas;
      public async execute() {
        // Prepare
        this.cut = new AvatarCanvas();

        // Execute
        document.body.appendChild(this.cut.body);
        document.body.style.width = "460px";
        document.body.style.height = "460px";

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_render.png",
          __dirname + "/golden/avatar_canvas_render.png",
          __dirname + "/avatar_canvas_render_diff.png",
          { fullPage: true }
        );

        // Execute
        let topLeftPoint = this.cut.body.querySelector(
          ".avatar-canvas-resize-point-top-left"
        );
        topLeftPoint.dispatchEvent(
          new MouseEvent("mousedown", {
            clientX: 120,
            clientY: 110,
            bubbles: true,
          })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_top_left_resize_mouse_down.png",
          __dirname + "/golden/avatar_canvas_top_left_resize_mouse_down.png",
          __dirname + "/avatar_canvas_top_left_resize_mouse_down_diff.png",
          { fullPage: true }
        );

        // Execute
        topLeftPoint.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: 100,
            clientY: 50,
            bubbles: true,
          })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_top_left_resize_mouse_move.png",
          __dirname + "/golden/avatar_canvas_top_left_resize_mouse_move.png",
          __dirname + "/avatar_canvas_top_left_resize_mouse_move_diff.png",
          { fullPage: true }
        );

        // Execute
        topLeftPoint.dispatchEvent(
          new MouseEvent("mouseup", {
            clientX: 150,
            clientY: 170,
            bubbles: true,
          })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_top_left_resize_mouse_up.png",
          __dirname + "/golden/avatar_canvas_top_left_resize_mouse_up.png",
          __dirname + "/avatar_canvas_top_left_resize_mouse_up_diff.png",
          { fullPage: true }
        );

        // Execute
        topLeftPoint.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: 100,
            clientY: 100,
            bubbles: true,
          })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_top_left_move_no_resize.png",
          __dirname + "/golden/avatar_canvas_top_left_resize_mouse_up.png",
          __dirname + "/avatar_canvas_top_left_move_no_resize_diff.png",
          { fullPage: true }
        );

        // Execute
        let topRightPoint = this.cut.body.querySelector(
          ".avatar-canvas-resize-point-top-right"
        );
        topRightPoint.dispatchEvent(
          new MouseEvent("mousedown", {
            clientX: 360,
            clientY: 100,
            bubbles: true,
          })
        );
        topRightPoint.dispatchEvent(
          new MouseEvent("mouseup", {
            clientX: 360,
            clientY: 100,
            bubbles: true,
          })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_top_right_resize.png",
          __dirname + "/golden/avatar_canvas_top_right_resize.png",
          __dirname + "/avatar_canvas_top_right_resize_diff.png",
          { fullPage: true }
        );

        // Execute
        let bottomRightPoint = this.cut.body.querySelector(
          ".avatar-canvas-resize-point-bottom-right"
        );
        bottomRightPoint.dispatchEvent(
          new MouseEvent("mousedown", {
            clientX: 300,
            clientY: 360,
            bubbles: true,
          })
        );
        bottomRightPoint.dispatchEvent(
          new MouseEvent("mouseup", {
            clientX: 300,
            clientY: 360,
            bubbles: true,
          })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_bottom_right_resize.png",
          __dirname + "/golden/avatar_canvas_bottom_right_resize.png",
          __dirname + "/avatar_canvas_bottom_right_resize_diff.png",
          { fullPage: true }
        );

        // Execute
        let bottomLeftPoint = this.cut.body.querySelector(
          ".avatar-canvas-resize-point-bottom-left"
        );
        bottomLeftPoint.dispatchEvent(
          new MouseEvent("mousedown", {
            clientX: 0,
            clientY: 360,
            bubbles: true,
          })
        );
        bottomLeftPoint.dispatchEvent(
          new MouseEvent("mouseup", {
            clientX: 0,
            clientY: 360,
            bubbles: true,
          })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_bottom_left_resize.png",
          __dirname + "/golden/avatar_canvas_bottom_left_resize.png",
          __dirname + "/avatar_canvas_bottom_left_resize_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "DrawImage";
      private cut: AvatarCanvas;
      public async execute() {
        // Prepare
        this.cut = new AvatarCanvas();
        document.body.appendChild(this.cut.body);
        document.body.style.width = "460px";
        document.body.style.height = "460px";
        let fileInput = E.input({ type: "file" });
        await puppeteerWaitForFileChooser();
        fileInput.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Execute
        await this.cut.load(fileInput.files[0]);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_draw_wide_image.png",
          __dirname + "/golden/avatar_canvas_draw_wide_image.png",
          __dirname + "/avatar_canvas_draw_wide_image_diff.png",
          { fullPage: true }
        );

        // Prepare
        await puppeteerWaitForFileChooser();
        fileInput.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/wider.jpg");

        // Execute
        await this.cut.load(fileInput.files[0]);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_draw_wider_image.png",
          __dirname + "/golden/avatar_canvas_draw_wider_image.png",
          __dirname + "/avatar_canvas_draw_wider_image_diff.png",
          { fullPage: true }
        );

        // Prepare
        await puppeteerWaitForFileChooser();
        fileInput.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/high.jpg");

        // Execute
        await this.cut.load(fileInput.files[0]);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_draw_high_image.png",
          __dirname + "/golden/avatar_canvas_draw_high_image.png",
          __dirname + "/avatar_canvas_draw_high_image_diff.png",
          { fullPage: true }
        );

        // Prepare
        await puppeteerWaitForFileChooser();
        fileInput.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/higher.jpg");

        // Execute
        await this.cut.load(fileInput.files[0]);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/avatar_canvas_draw_higher_image.png",
          __dirname + "/golden/avatar_canvas_draw_higher_image.png",
          __dirname + "/avatar_canvas_draw_higher_image_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "Export";
      private cut: AvatarCanvas;
      public async execute() {
        // Prepare
        this.cut = new AvatarCanvas();
        document.body.appendChild(this.cut.body);
        document.body.style.width = "460px";
        document.body.style.height = "460px";
        let fileInput = E.input({ type: "file" });
        await puppeteerWaitForFileChooser();
        fileInput.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");
        await this.cut.load(fileInput.files[0]);

        let topLeftPoint = this.cut.body.querySelector(
          ".avatar-canvas-resize-point-top-left"
        );
        topLeftPoint.dispatchEvent(
          new MouseEvent("mousedown", {
            clientX: 50,
            clientY: 70,
            bubbles: true,
          })
        );

        // Execute
        let fileBlob = await this.cut.export();

        // Verify
        let fileData = await new Promise<string>((resolve) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsBinaryString(fileBlob);
        });
        await puppeteerWriteFile(__dirname + "/cropped.png", fileData);
        let goldenFileData = await puppeteerReadFile(
          __dirname + "/golden/cropped.png",
          "binary"
        );
        assertThat(fileData, eq(goldenFileData), "cropped file");

        // Cleanup
        await puppeteerDeleteFile(__dirname + "/cropped.png");
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
