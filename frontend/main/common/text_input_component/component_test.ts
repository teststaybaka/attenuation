import { normalizeBody } from "../normalize_body";
import { TextInputComponent } from "./component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

PUPPETEER_TEST_RUNNER.run({
  name: "TextInputComponentText",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Execute
        let component = new TextInputComponent("label here").init();
        document.body.appendChild(component.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_text_input_component.png",
          __dirname + "/golden/render_text_input_component.png",
          __dirname + "/render_text_input_component_diff.png",
          { fullPage: true }
        );

        // Execute
        component.showError("something wrong!!");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_error_text_input_component.png",
          __dirname + "/golden/render_error_text_input_component.png",
          __dirname + "/render_error_text_input_component_diff.png",
          { fullPage: true }
        );
      },
      tearDown: () => {
        if (document.body.lastChild) {
          document.body.removeChild(document.body.lastChild);
        }
      },
    },
  ],
});
