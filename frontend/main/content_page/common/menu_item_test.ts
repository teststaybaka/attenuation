import { normalizeBody } from "../../common/normalize_body";
import { MenuItem } from "./menu_item";
import { createHomeMenuIcon } from "./menu_items";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "MenuItemTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new MenuItem(createHomeMenuIcon(), "A long long test label");
        this.container = E.div({}, cut.body);
        let item = this.container.querySelector(".menu-item");

        // Execute
        document.body.append(this.container);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/menu_item_render.png",
          __dirname + "/golden/menu_item_render.png",
          __dirname + "/menu_item_render_diff.png",
          { fullPage: true }
        );

        // Execute
        item.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/menu_item_hover.png",
          __dirname + "/golden/menu_item_hover.png",
          __dirname + "/menu_item_hover_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
