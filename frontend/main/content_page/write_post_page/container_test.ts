import { normalizeBody } from "../../common/normalize_body";
import { WritePostPage } from "./container";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "WritePostPageTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: WritePostPage;
      public async execute() {
        // Prepare
        this.cut = WritePostPage.create();
        document.body.append(this.cut.body);
        await puppeteerSetViewport(1000, 600);

        // Execute
        this.cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_post_page_render.png",
          __dirname + "/golden/write_post_page_render.png",
          __dirname + "/write_post_page_render_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
