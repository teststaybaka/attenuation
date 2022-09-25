import { normalizeBody } from "./normalize_body";
import { HorizontalTextInput } from "./text_input";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "TextInputTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderHorizontalTextInput";
      private div: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = HorizontalTextInput.create("Input:");

        // Execute
        this.div = E.div(
          {},
          cut.body,
          E.div(
            {
              style: `font-size: 1.4rem; color: black;`,
            },
            E.text("following lines....")
          )
        );
        document.body.append(this.div);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/horizontal_text_input_render.png",
          __dirname + "/golden/horizontal_text_input_render.png",
          __dirname + "/horizontal_text_input_diff_render.png"
        );

        // Execute
        cut.showError('Failed to validate.');

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/horizontal_text_input_with_error.png",
          __dirname + "/golden/horizontal_text_input_with_error.png",
          __dirname + "/horizontal_text_input_with_error_diff.png"
        );

        // Execute
        cut.hideError();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/horizontal_text_input_hide_error.png",
          __dirname + "/golden/horizontal_text_input_render.png",
          __dirname + "/horizontal_text_input_hide_error_diff.png"
        );
      }
      public tearDown() {
        this.div.remove();
      }
    })(),
  ],
});
