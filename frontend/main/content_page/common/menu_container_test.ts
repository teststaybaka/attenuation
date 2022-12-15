import { normalizeBody } from "../../common/normalize_body";
import { MenuContainer } from "./menu_container";
import { createHomeMenuItem, createRefreshMenuItem } from "./menu_items";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "MenuContainerTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new MenuContainer(
          createHomeMenuItem(),
          createRefreshMenuItem()
        );
        this.container = E.div({}, cut.body);
        document.body.appendChild(this.container);

        // Execute
        cut.expand();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/menu_container_render.png",
          __dirname + "/golden/menu_container_render.png",
          __dirname + "/menu_container_render_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
