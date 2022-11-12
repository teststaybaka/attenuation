import { normalizeBody } from "./common/normalize_body";
import { SignInPage } from "./sign_in_page";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "SignInPageTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderTall";
      private cut: SignInPage;
      public async execute() {
        // Prepare
        this.cut = new SignInPage(undefined, undefined);
        await puppeteerSetViewport(1000, 1000);
        document.body.appendChild(this.cut.body);

        // Execute
        this.cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_sign_in_page_tall.png",
          __dirname + "/golden/render_sign_in_page_tall.png",
          __dirname + "/render_sign_in_page_tall_diff.png"
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "RenderShort";
      private cut: SignInPage;
      public async execute() {
        // Prepare
        this.cut = new SignInPage(undefined, undefined);
        await puppeteerSetViewport(1000, 150);
        document.body.appendChild(this.cut.body);

        // Execute
        this.cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_sign_in_page_short.png",
          __dirname + "/golden/render_sign_in_page_short.png",
          __dirname + "/render_sign_in_page_short_diff.png"
        );

        // Execute
        window.scrollTo(0, document.body.scrollHeight);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_sign_in_page_short_bottom.png",
          __dirname + "/golden/render_sign_in_page_short_bottom.png",
          __dirname + "/render_sign_in_page_short_bottom_diff.png"
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
