import path = require("path");
import { normalizeBody } from "../../common/normalize_body";
import { AccountBasicTab } from "./account_basic_tab";
import { E } from "@selfage/element/factory";
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
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new AccountBasicTab(
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
        this.container = E.div({}, cut.body);
        document.body.style.width = "1000px";
        document.body.appendChild(this.container);

        // Execute
        await cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_basic_tab_render.png",
          __dirname + "/golden/account_basic_tab_render.png",
          __dirname + "/account_basic_tab_diff_render.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "HoverAndClick";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new AccountBasicTab(
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
        this.container = E.div({}, cut.body);
        document.body.style.width = "1000px";
        document.body.appendChild(this.container);
        await cut.show();
        let avatar = this.container.querySelector(".account-basic-avatar");

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
        cut.on("changeAvatar", () => (changed = true));

        // Execute
        avatar.dispatchEvent(new MouseEvent("click"));

        // Verify
        assertThat(changed, eq(true), "changed avatar");
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
