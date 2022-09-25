import { FillButton } from "./button";
import { normalizeBody } from "./normalize_body";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "ButtonTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderFillButton";
      private cut: FillButton;
      public async execute() {
        // Prepare
        this.cut = FillButton.create(true, E.text("some button"));

        // Execute
        document.body.append(this.cut.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/fill_button_render.png",
          __dirname + "/golden/fill_button_render.png",
          __dirname + "/fill_button_render_diff.png"
        );

        // Execute
        this.cut.body.dispatchEvent(new MouseEvent("mousedown"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/fill_button_down.png",
          __dirname + "/golden/fill_button_down.png",
          __dirname + "/fill_button_down_diff.png"
        );

        // Execute
        this.cut.body.dispatchEvent(new MouseEvent('mouseup'));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/fill_button_up.png",
          __dirname + "/golden/fill_button_render.png",
          __dirname + "/fill_button_up_diff.png"
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
