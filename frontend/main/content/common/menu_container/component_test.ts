import { normalizeBody } from "../../../common/normalize_body";
import {
  createHomeMenuItem,
  createRefreshMenuItem,
} from "../../common/menu_items";
import { MenuContainer } from "./component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "MenuContainerTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private component: MenuContainer;
      public async execute() {
        // Prepare
        this.component = new MenuContainer(
          createHomeMenuItem(),
          createRefreshMenuItem()
        );
        document.body.appendChild(this.component.body);

        // Execute
        this.component.expand();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render.png",
          __dirname + "/golden/render.png",
          __dirname + "/render_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
  ],
});
