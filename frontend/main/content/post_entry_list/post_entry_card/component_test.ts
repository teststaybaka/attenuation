import path = require("path");
import { normalizeBody } from "../../../common/normalize_body";
import { PostEntryCardComponent } from "./component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "PostEntryCardComponentTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Execute
        document.body.appendChild(
          new PostEntryCardComponent({
            avatarSmallPath: path.join(
              __dirname,
              "../../common/user_image.jpg"
            ),
            username: "some-name",
            userNatureName: "Some Name",
            content: "blahblahblahblah\nsomethingsomething",
            createdTimestamp: Date.parse("2022-10-11"),
          }).body
        );

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
