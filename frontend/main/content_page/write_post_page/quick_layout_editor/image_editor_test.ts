import { normalizeBody } from "../../../common/normalize_body";
import { ImageEditor } from "./image_editor";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { E } from "@selfage/element/factory";

normalizeBody();

TEST_RUNNER.run({
  name: "ImageEditorTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderWide";
      private cut: ImageEditor;
      public async execute() {
        // Prepare
        let fileInput = E.input({ type: "file" });
        await puppeteerWaitForFileChooser();
        fileInput.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");
        await puppeteerSetViewport(200, 300);

        // Execute
        this.cut = await ImageEditor.create(fileInput.files[0]);
        document.body.append(this.cut.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_image_editor_wide.png",
          __dirname + "/golden/render_image_editor_wide.png",
          __dirname + "/render_image_editor_wide_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        if (this.cut) {
        this.cut.body.remove();
        }
      }
    })(),
    new (class implements TestCase {
      public name = "RenderTall";
      private cut: ImageEditor;
      public async execute() {
        // Prepare
        let fileInput = E.input({ type: "file" });
        await puppeteerWaitForFileChooser();
        fileInput.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/tall.webp");
        await puppeteerSetViewport(200, 300);

        // Execute
        this.cut = await ImageEditor.create(fileInput.files[0]);
        document.body.append(this.cut.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_image_editor_tall.png",
          __dirname + "/golden/render_image_editor_tall.png",
          __dirname + "/render_image_editor_tall_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        if (this.cut) {
        this.cut.body.remove();
        }
      }
    })(),
  ],
});
