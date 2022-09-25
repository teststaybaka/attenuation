import userImage = require("./common/user_image.jpg");
import { normalizeBody } from "../common/normalize_body";
import { AccountPageMock } from "./account_page/mocks";
import { ContentPage } from "./container";
import { PostEntryListPageMock } from "./post_entry_list_page/mocks";
import { ContentState, Page } from "./state";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "ContentPageTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: ContentPage;
      public async execute() {
        // Prepare
        let state = new ContentState();
        state.page = Page.HOME;
        this.cut = new ContentPage(
          () => {
            return new AccountPageMock();
          },
          () => {
            return new PostEntryListPageMock([
              {
                postEntryId: "1",
                userNatureName: "My name",
                username: "my-name",
                avatarSmallPath: userImage,
                content: "Something to say",
                createdTimestamp: Date.parse("2022-10-11"),
              },
            ]);
          },
          state
        );
        document.body.appendChild(this.cut.body);

        // Execute
        this.cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/content_page_render.png",
          __dirname + "/golden/content_page_render.png",
          __dirname + "/content_page_render_diff.png"
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
