import userImage = require("./common/user_image.jpg");
import { normalizeBody } from "../common/normalize_body";
import { AccountPageMock } from "./account_page/mocks";
import { ContentPage } from "./container";
import { PostEntryListPageMock } from "./post_entry_list_page/mocks";
import { ContentState } from "./state";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "ContentPageTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: ContentPage;
      public async execute() {
        // Prepare
        let accountPageMock = new AccountPageMock();
        let postEntryListPageMock = new PostEntryListPageMock([
          {
            postEntryId: "1",
            userNatureName: "My name",
            username: "my-name",
            avatarSmallPath: userImage,
            content: "Something to say",
            createdTimestamp: Date.parse("2022-10-11"),
          },
        ]);
        this.cut = new ContentPage(
          () => {
            return accountPageMock;
          },
          () => {
            return postEntryListPageMock;
          },
          new ContentState()
        );
        await puppeteerSetViewport(1000, 1000);
        document.body.appendChild(this.cut.body);

        // Execute
        this.cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/content_page_render.png",
          __dirname + "/golden/content_page_render.png",
          __dirname + "/content_page_render_diff.png"
        );

        // Execute
        postEntryListPageMock.emit("account");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/content_page_switch_to_account.png",
          __dirname + "/golden/content_page_switch_to_account.png",
          __dirname + "/content_page_switch_to_account_diff.png"
        );

        // Execute
        accountPageMock.emit("home");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/content_page_switch_to_home.png",
          __dirname + "/golden/content_page_render.png",
          __dirname + "/content_page_switch_to_home_diff.png"
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
