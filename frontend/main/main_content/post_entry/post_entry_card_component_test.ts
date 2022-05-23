import { normalizeBody } from "../../../common/normalize_body";
import { PostEntryCardComponent } from "./post_entry_card_component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

PUPPETEER_TEST_RUNNER.run({
  name: "PostCardComponentTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Prepare
        mockExactFile(
          "https://gcs/user_image.jpg",
          __dirname + "/user_image.jpg"
        );

        // Execute
        document.body.appendChild(
          new PostEntryCardComponent({
            userProfilePicture: "https://gcs/user_image.jpg",
            username: "some-name",
            userNatureName: "Some Name",
            content: "blahblahblahblah\nsomethingsomething",
            createdTimestamp: Date.parse("2022-10-11"),
          }).body
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/post_entry_card_component.png",
          __dirname + "/golden/post_entry_card_component.png",
          __dirname + "/post_entry_card_component_diff.png",
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
