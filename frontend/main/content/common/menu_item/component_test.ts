import { normalizeBody } from "../../../common/normalize_body";
import { createHomeMenuIcon } from "../menu_items";
import { MenuItem } from "./component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "MenuItemTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private component: MenuItem;
      public async execute() {
        // Prepare
        this.component = new MenuItem(
          createHomeMenuIcon(),
          "A long long test label"
        ).init();

        // Execute
        document.body.appendChild(this.component.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render.png",
          __dirname + "/golden/render.png",
          __dirname + "/render_diff.png",
          { fullPage: true }
        );

        // Execute
        this.component.body.dispatchEvent(
          new MouseEvent("mouseover", { bubbles: true })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_hover.png",
          __dirname + "/golden/render_hover.png",
          __dirname + "/render_hover_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
  ],
});
