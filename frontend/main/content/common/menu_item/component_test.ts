import { normalizeBody } from "../../../common/normalize_body";
import { createHomeMenuIcon } from "../menu_items";
import { MenuItemComponent } from "./component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "MenuItemComponentTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Prepare
        let component = new MenuItemComponent(
          createHomeMenuIcon(),
          "A long long test label"
        ).init();

        // Execute
        document.body.appendChild(component.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component.png",
          __dirname + "/golden/render_component.png",
          __dirname + "/render_component_diff.png",
          { fullPage: true }
        );

        // Execute
        component.body.dispatchEvent(
          new MouseEvent("mouseover", { bubbles: true })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_hover.png",
          __dirname + "/golden/render_component_hover.png",
          __dirname + "/render_component_hover_diff.png",
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
