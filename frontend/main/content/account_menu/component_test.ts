import { normalizeBody } from "../../common/normalize_body";
import {
  createHomeMenuItemComponent,
  createRefreshMenuItemComponent,
} from "../common/menu_items";
import { AccountMenuComponent } from "./component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "AccountMenuTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Prepare
        let component = new AccountMenuComponent(
          createHomeMenuItemComponent(),
          createRefreshMenuItemComponent()
        ).init();

        // Execute
        document.body.appendChild(component.body);
        component.expand();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component.png",
          __dirname + "/golden/render_component.png",
          __dirname + "/render_component_diff.png",
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
