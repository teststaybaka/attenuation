import { normalizeBody } from "../../common/normalize_body";
import { MenuItem } from "./menu_item";
import { createHomeMenuIcon } from "./menu_items";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "MenuItemTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: MenuItem;
      public async execute() {
        // Prepare
        this.cut = new MenuItem(createHomeMenuIcon(), "A long long test label");

        // Execute
        document.body.appendChild(this.cut.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/menu_item_render.png",
          __dirname + "/golden/menu_item_render.png",
          __dirname + "/menu_item_render_diff.png",
          { fullPage: true }
        );

        // Execute
        this.cut.body.dispatchEvent(
          new MouseEvent("mouseover", { bubbles: true })
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/menu_item_hover.png",
          __dirname + "/golden/menu_item_hover.png",
          __dirname + "/menu_item_hover_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
