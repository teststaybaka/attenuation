import path = require("path");
import { AvatarUrlComposer } from "../../common/avatar_url_composer";
import { normalizeBody } from "../../common/normalize_body";
import { AccountPage } from "./container";
import { AccountBasicTabMock, ChangeAvatarTabMock } from "./mocks";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "AccountPageTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let accountBasicMock = new AccountBasicTabMock({
          username: "some user name",
          naturalName: "Mr. Your Name",
          email: "xxxxx@gmail.com",
          avatarLargePath: AvatarUrlComposer.compose(
            path.join(__dirname, "../common/user_image.jpg")
          ),
        });
        let cut = new AccountPage(
          accountBasicMock,
          new ChangeAvatarTabMock()
        );
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            ...cut.menuBodies,
          ),
          E.div(
            {
              style: `width: 1000px;`,
            },
            cut.body
          )
        );
        document.body.append(this.container);

        // Execute
        await cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_page_render.png",
          __dirname + "/golden/account_page_render.png",
          __dirname + "/account_page_render_diff.png",
          { fullPage: true }
        );

        // Execute
        accountBasicMock.emit("changeAvatar");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_page_change_avatar.png",
          __dirname + "/golden/account_page_change_avatar.png",
          __dirname + "/account_page_change_avatar_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
