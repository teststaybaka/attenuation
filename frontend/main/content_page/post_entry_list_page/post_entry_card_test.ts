import userImage = require("../common/user_image.jpg");
import { normalizeBody } from "../../common/normalize_body";
import { PostEntryCard } from "./post_entry_card";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "PostEntryCardTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: PostEntryCard;
      public async execute() {
        // Execute
        this.cut = new PostEntryCard({
          avatarSmallPath: userImage,
          username: "some-name",
          userNatureName: "Some Name",
          content: "blahblahblahblah\nsomethingsomething",
          createdTimestamp: Date.parse("2022-10-11"),
        });
        document.body.appendChild(this.cut.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/post_entry_card_render.png",
          __dirname + "/golden/post_entry_card_render.png",
          __dirname + "/post_entry_card_render_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
