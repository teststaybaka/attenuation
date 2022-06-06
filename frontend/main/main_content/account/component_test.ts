import path = require("path");
import { normalizeBody } from "../../common/normalize_body";
import { AccountComponent } from "./component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { ServiceClient } from "@selfage/service_client";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

PUPPETEER_TEST_RUNNER.run({
  name: "AccountComponentTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Prepare
        let component = new AccountComponent(
          new (class extends ServiceClient {
            public constructor() {
              super(undefined, undefined);
            }
            public fetchAuthed() {
              return {
                basicUserInfo: {
                  username: "some-name",
                  naturalName: "Some Name",
                  email: "somename@something.com",
                  profileUrl: path.join(__dirname, "../common/user_image.jpg"),
                },
              } as any;
            }
          })()
        ).init();

        // Execute
        await component.refresh();
        document.body.appendChild(component.body);
        document.body.style.width = "1000px";
        component.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_narrow.png",
          __dirname + "/golden/render_component_narrow.png",
          __dirname + "/render_component_narrow_diff.png",
          { fullPage: true }
        );

        // Execute
        document.body.style.width = "1300px";

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_wide.png",
          __dirname + "/golden/render_component_wide.png",
          __dirname + "/render_component_wide_diff.png",
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
