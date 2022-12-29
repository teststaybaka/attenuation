import userImage = require("./test_data/user_image.jpg");
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
        let accountBasicTabMock = new AccountBasicTabMock({
          username: "some user name",
          naturalName: "Mr. Your Name",
          email: "xxxxx@gmail.com",
          avatarLargePath: userImage,
        });
        let changeAvatarTabMock = new ChangeAvatarTabMock();
        let cut = new AccountPage(accountBasicTabMock, changeAvatarTabMock);
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            ...cut.menuBodies
          ),
          E.div({}, cut.body)
        );
        await puppeteerSetViewport(1600, 800);
        document.body.append(this.container);

        // Execute
        await cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_page_render_wide.png",
          __dirname + "/golden/account_page_render_wide.png",
          __dirname + "/account_page_render_wide_diff.png",
          { fullPage: true }
        );

        // Execute
        await puppeteerSetViewport(1000, 800);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_page_render_narrow.png",
          __dirname + "/golden/account_page_render_narrow.png",
          __dirname + "/account_page_render_narrow_diff.png",
          { fullPage: true }
        );

        // Execute
        accountBasicTabMock.emit("changeAvatar");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_page_change_avatar.png",
          __dirname + "/golden/account_page_change_avatar.png",
          __dirname + "/account_page_change_avatar_diff.png",
          { fullPage: true }
        );

        // Execute
        changeAvatarTabMock.emit("back");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_page_back_to_account_basic.png",
          __dirname + "/golden/account_page_render_narrow.png",
          __dirname + "/account_page_back_to_account_basic_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.accountMenuItem.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/account_page_render_account_basic_again.png",
          __dirname + "/golden/account_page_render_narrow.png",
          __dirname + "/account_page_render_account_basic_again.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
