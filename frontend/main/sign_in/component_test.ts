import { FillButtonComponent } from "../common/button/component";
import { normalizeBody } from "../common/normalize_body";
import { SignInComponent } from "./component";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "SignInComponentTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderTall";
      private component: SignInComponent;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(1000, 1000);
        this.component = new SignInComponent(
          FillButtonComponent.create(true, E.text("Sign in")),
          undefined,
          undefined
        ).init();
        document.body.appendChild(this.component.body);

        // Execute
        this.component.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_tall.png",
          __dirname + "/golden/render_tall.png",
          __dirname + "/render_tall_diff.png"
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "RenderShort";
      private component: SignInComponent;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(1000, 150);
        this.component = new SignInComponent(
          FillButtonComponent.create(true, E.text("Sign in")),
          undefined,
          undefined
        ).init();
        document.body.appendChild(this.component.body);

        // Execute
        this.component.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_short.png",
          __dirname + "/golden/render_short.png",
          __dirname + "/render_short_diff.png"
        );

        // Execute
        window.scrollTo(0, document.body.scrollHeight);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_short_bottom.png",
          __dirname + "/golden/render_short_bottom.png",
          __dirname + "/render_short_bottom_diff.png"
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
  ],
});
