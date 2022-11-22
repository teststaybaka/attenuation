import { normalizeBody } from "../../common/normalize_body";
import { MenuContainer } from "./menu_container";
import { createHomeMenuItem, createRefreshMenuItem } from "./menu_items";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "MenuContainerTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: MenuContainer;
      public async execute() {
        // Prepare
        this.cut = new MenuContainer(
          createHomeMenuItem(),
          createRefreshMenuItem()
        );
        document.body.appendChild(this.cut.body);

        // Execute
        this.cut.expand();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/menu_container_render.png",
          __dirname + "/golden/menu_container_render.png",
          __dirname + "/menu_container_render_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
