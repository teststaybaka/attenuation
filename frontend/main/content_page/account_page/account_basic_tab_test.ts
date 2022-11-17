import path = require("path");
import { normalizeBody } from "../../common/normalize_body";
import { AccountBasicTab } from "./account_basic_tab";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

TEST_RUNNER.run({
  name: "AccountBasicTabTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: AccountBasicTab;
      public async execute() {
        // Prepare
        document.body.style.width = "1000px";
        this.cut = new AccountBasicTab(
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
                  "../common/user_image.jpg"
                ),
              } as any;
            }
          })()
        );
        document.body.appendChild(this.cut.body);

        // Execute
        await this.cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_basic_tab_render.png",
          __dirname + "/golden/account_basic_tab_render.png",
          __dirname + "/account_basic_tab_diff_render.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "HoverAndClick";
      private cut: AccountBasicTab;
      public async execute() {
        // Prepare
        document.body.style.width = "1000px";
        this.cut = new AccountBasicTab(
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
                  "../common/user_image.jpg"
                ),
              } as any;
            }
          })()
        );
        document.body.appendChild(this.cut.body);
        await this.cut.show();
        let avatar = this.cut.body.querySelector(".account-basic-avatar");

        // Execute
        avatar.dispatchEvent(new MouseEvent("mouseenter"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_basic_tab_hover_avatar.png",
          __dirname + "/golden/account_basic_tab_hover_avatar.png",
          __dirname + "/account_basic_tab_hover_avatar_diff.png",
          { fullPage: true }
        );

        // Prepare
        let changed = false;
        this.cut.on("changeAvatar", () => (changed = true));

        // Execute
        avatar.dispatchEvent(new MouseEvent("click"));

        // Verify
        assertThat(changed, eq(true), "changed avatar");
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
