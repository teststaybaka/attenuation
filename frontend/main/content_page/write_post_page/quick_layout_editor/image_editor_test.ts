import tallImage = require("./test_data/tall.webp");
import wideImage = require("./test_data/wide.jpeg");
import { normalizeBody } from "../../../common/normalize_body";
import { ImageEditor } from "./image_editor";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "ImageEditorTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderWide";
      private cut: ImageEditor;
      public async execute() {
        // Execute
        this.cut = ImageEditor.create(wideImage);
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
        // Execute
        this.cut = await ImageEditor.create(tallImage);
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
