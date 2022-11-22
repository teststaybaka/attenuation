import { FillButton, OutlineButton } from "../../common/button";
import { normalizeBody } from "../../common/normalize_body";
import { createBackMenuIcon } from "../common/menu_items";
import { MenuItemMock } from "../common/mocks";
import { ChangeAvatarTab } from "./change_avatar_tab";
import { AvatarCanvasMock } from "./mocks";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";

normalizeBody();

TEST_RUNNER.run({
  name: "ChangeAvatarTabTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let chooseButton = OutlineButton.create(
          true,
          E.text("Choose an image file")
        );
        let avatarCanvasMock = new (class extends AvatarCanvasMock {
          public async load(imageFile: File): Promise<void> {
            await new Promise<void>((resolve) => {
              let fileReader = new FileReader();
              fileReader.onload = () => {
                let image = new Image();
                image.onload = () => {
                  this.canvas.width = 460;
                  this.canvas.height = 460;
                  this.canvas.getContext("2d").drawImage(image, 0, 0, 460, 460);
                  this.sx = 130;
                  this.sy = 130;
                  this.sWidth = 200;
                  this.sHeight = 200;
                  this.emit("change");
                  resolve();
                };
                image.src = fileReader.result as string;
              };
              fileReader.readAsDataURL(imageFile);
            });
          }
        })();
        let cut = new ChangeAvatarTab(
          new MenuItemMock(createBackMenuIcon(), "Back"),
          avatarCanvasMock,
          chooseButton,
          FillButton.create(false, E.text("Upload")),
          undefined
        );
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.menuBody
          ),
          E.div({}, cut.body)
        );
        document.body.style.width = "1000px";
        document.body.appendChild(this.container);

        // Execute
        cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/change_avatar_tab_render.png",
          __dirname + "/golden/change_avatar_tab_render.png",
          __dirname + "/change_avatar_tab_render_diff.png",
          { fullPage: true }
        );

        // Execute
        await puppeteerWaitForFileChooser();
        chooseButton.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/change_avatar_tab_loaded.png",
          __dirname + "/golden/change_avatar_tab_loaded.png",
          __dirname + "/change_avatar_tab_loaded_diff.png",
          { fullPage: true }
        );

        // Prepare
        avatarCanvasMock.sx = 100;
        avatarCanvasMock.sy = 10;
        avatarCanvasMock.sWidth = 130;
        avatarCanvasMock.sHeight = 130;

        // Execute
        avatarCanvasMock.emit("change");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/change_avatar_tab_moved_resized.png",
          __dirname + "/golden/change_avatar_tab_moved_resized.png",
          __dirname + "/change_avatar_tab_moved_resized_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "LoadError";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let chooseButton = OutlineButton.create(
          true,
          E.text("Choose an image file")
        );
        let cut = new ChangeAvatarTab(
          new MenuItemMock(createBackMenuIcon(), "Back"),
          new (class extends AvatarCanvasMock {
            public async load(imageFile: File): Promise<void> {
              throw new Error("load error");
            }
          })(),
          chooseButton,
          FillButton.create(false, E.text("Upload")),
          undefined
        );
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.menuBody
          ),
          E.div({}, cut.body)
        );
        document.body.style.width = "1000px";
        document.body.appendChild(this.container);
        cut.show();

        // Execute
        await puppeteerWaitForFileChooser();
        chooseButton.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/change_avatar_tab_load_error.png",
          __dirname + "/golden/change_avatar_tab_load_error.png",
          __dirname + "/change_avatar_tab_load_error_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "Upload";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let uploadButton = FillButton.create(true, E.text("Upload"));
        let clientMock = new (class extends WebServiceClient {
          public counter = new Counter<string>();
          public constructor() {
            super(undefined, undefined);
          }
          public async send(request: any): Promise<any> {
            switch (this.counter.increment("send")) {
              case 1:
                throw new Error("upload error");
              case 2:
                let toBeSent = await new Promise<string>((resolve) => {
                  let fileReader = new FileReader();
                  fileReader.onload = () => {
                    resolve(fileReader.result as string);
                  };
                  fileReader.readAsBinaryString(request.request.body as Blob);
                });
                let source = await puppeteerReadFile(
                  __dirname + "/test_data/wide.jpeg",
                  "binary"
                );
                assertThat(toBeSent, eq(source), "file content");
                break;
              default:
                throw new Error("Not reachable.");
            }
          }
        })();
        let cut = new ChangeAvatarTab(
          new MenuItemMock(createBackMenuIcon(), "Back"),
          new (class extends AvatarCanvasMock {
            public async export(): Promise<Blob> {
              let input = E.input({ type: "file" });
              await puppeteerWaitForFileChooser();
              input.click();
              await puppeteerFileChooserAccept(
                __dirname + "/test_data/wide.jpeg"
              );
              return input.files[0];
            }
          })(),
          OutlineButton.create(true, E.text("Choose an image file")),
          uploadButton,
          clientMock
        );
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            cut.menuBody
          ),
          E.div({}, cut.body)
        );
        document.body.style.width = "1000px";
        document.body.appendChild(this.container);
        cut.show();

        // Execute
        await uploadButton.click();

        // Verify
        assertThat(clientMock.counter.get("send"), eq(1), "send times");
        await asyncAssertScreenshot(
          __dirname + "/change_avatar_tab_upload_error.png",
          __dirname + "/golden/change_avatar_tab_upload_error.png",
          __dirname + "/change_avatar_tab_upload_error_diff.png",
          { fullPage: true }
        );

        // Execute
        await uploadButton.click();

        // Verify
        assertThat(clientMock.counter.get("send"), eq(2), "send times");
        await asyncAssertScreenshot(
          __dirname + "/change_avatar_tab_upload_success.png",
          __dirname + "/golden/change_avatar_tab_upload_success.png",
          __dirname + "/change_avatar_tab_upload_success_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
    {
      name: "Back",
      execute: () => {
        // Prepare
        let backButton = new MenuItemMock(createBackMenuIcon(), "Back");
        let cut = new ChangeAvatarTab(
          backButton,
          new AvatarCanvasMock(),
          OutlineButton.create(true, E.text("Choose an image file")),
          FillButton.create(false, E.text("Upload")),
          undefined
        );
        let isBack = false;
        cut.on("back", () => (isBack = true));

        // Execute
        backButton.click();

        // Verify
        assertThat(isBack, eq(true), "Back");
      },
    },
  ],
});
