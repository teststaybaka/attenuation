import path = require("path");
import { AvatarUrlComposer } from "../../common/avatar_url_composer";
import { normalizeBody } from "../../common/normalize_body";
import { createBackMenuItem, createHomeMenuItem } from "../common/menu_items";
import { AccountBasicComponentMock } from "./account_basic/mock";
import { ChangeAvatarComponentMock } from "./change_avatar/mock";
import { AccountComponent } from "./component";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "AccountComponent",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let accountBasicMock = new (class extends AccountBasicComponentMock {
          public async show() {
            this.body.style.display = "flex";
            this.usernameValue.textContent = "some user name";
            this.naturalNameValue.textContent = "Mr. Your Name";
            this.emailValue.textContent = "xxxxx@gmail.com";
            this.avatarImage.src = AvatarUrlComposer.compose(
              path.join(__dirname, "../common/user_image.jpg")
            );
          }
        })();
        let component = new AccountComponent(
          accountBasicMock,
          new ChangeAvatarComponentMock(),
          createHomeMenuItem(),
          createBackMenuItem()
        ).init();
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            component.menuBody,
            component.backMenuBody
          ),
          E.div(
            {
              style: `width: 1000px;`,
            },
            component.body
          )
        );
        document.body.append(this.container);

        // Execute
        await component.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render.png",
          __dirname + "/golden/render.png",
          __dirname + "/render_diff.png",
          { fullPage: true }
        );

        // Execute
        accountBasicMock.emit("changeAvatar");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_change_avatar.png",
          __dirname + "/golden/render_change_avatar.png",
          __dirname + "/render_change_avatar_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
