import path = require("path");
import { normalizeBody } from "../../../common/normalize_body";
import { AccountBasicComponent } from "./component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "AccountBasicComponentTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private component: AccountBasicComponent;
      public async execute() {
        // Prepare
        document.body.style.width = "1000px";
        this.component = new AccountBasicComponent(
          new (class extends WebServiceClient {
            public constructor() {
              super(undefined, undefined);
            }
            public send() {
              return {
                username: "some-name",
                naturalName: "Some Name",
                email: "somename@something.com",
                avatarLargePath: path.join(
                  __dirname,
                  "../../common/user_image.jpg"
                ),
              } as any;
            }
          })()
        ).init();
        document.body.appendChild(this.component.body);

        // Execute
        await this.component.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render.png",
          __dirname + "/golden/render.png",
          __dirname + "/render_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "Hover";
      private component: AccountBasicComponent;
      public async execute() {
        // Prepare
        document.body.style.width = "1000px";
        this.component = new AccountBasicComponent(
          new (class extends WebServiceClient {
            public constructor() {
              super(undefined, undefined);
            }
            public send() {
              return {
                username: "some-name",
                naturalName: "Some Name",
                email: "somename@something.com",
                avatarLargePath: path.join(
                  __dirname,
                  "../../common/user_image.jpg"
                ),
              } as any;
            }
          })()
        ).init();
        document.body.appendChild(this.component.body);
        await this.component.show();

        // Execute
        this.component.body
          .querySelector(".account-basic-avatar")
          .dispatchEvent(new MouseEvent("mouseenter"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/hover_avatar.png",
          __dirname + "/golden/hover_avatar.png",
          __dirname + "/hover_avatar_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
  ],
});
