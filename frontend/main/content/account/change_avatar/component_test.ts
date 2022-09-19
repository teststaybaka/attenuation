import {
  FillButtonComponent,
  OutlineButtonComponent,
} from "../../../common/button/component";
import { normalizeBody } from "../../../common/normalize_body";
import { AvatarCanvasComponentMock } from "./avatar_canvas/mock";
import { ChangeAvatarComponent } from "./component";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";

normalizeBody();

TEST_RUNNER.run({
  name: "ChangeAvatarComponentTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private component: ChangeAvatarComponent;
      public async execute() {
        // Prepare
        document.body.style.width = "1000px";
        let chooseButton = OutlineButtonComponent.create(
          true,
          E.text("Choose an image file")
        );
        let avatarCanvasMock = new (class extends AvatarCanvasComponentMock {
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
        this.component = new ChangeAvatarComponent(
          avatarCanvasMock,
          chooseButton,
          FillButtonComponent.create(false, E.text("Upload")),
          undefined
        ).init();
        document.body.appendChild(this.component.body);

        // Execute
        this.component.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render.png",
          __dirname + "/golden/render.png",
          __dirname + "/render_diff.png",
          { fullPage: true }
        );

        // Execute
        await puppeteerWaitForFileChooser();
        chooseButton.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_loaded.png",
          __dirname + "/golden/render_loaded.png",
          __dirname + "/render_loaded_diff.png",
          { fullPage: true }
        );

        // Prepare
        avatarCanvasMock.sx = 100;
        avatarCanvasMock.sy = 10;
        avatarCanvasMock.sWidth = 130;
        avatarCanvasMock.sHeight = 130;
        avatarCanvasMock.emit("change");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_moved_resized.png",
          __dirname + "/golden/render_moved_resized.png",
          __dirname + "/render_moved_resized_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "LoadError";
      private component: ChangeAvatarComponent;
      public async execute() {
        // Prepare
        document.body.style.width = "1000px";
        let chooseButton = OutlineButtonComponent.create(
          true,
          E.text("Choose an image file")
        );
        this.component = new ChangeAvatarComponent(
          new (class extends AvatarCanvasComponentMock {
            public async load(imageFile: File): Promise<void> {
              throw new Error("load error");
            }
          })(),
          chooseButton,
          FillButtonComponent.create(false, E.text("Upload")),
          undefined
        ).init();
        document.body.appendChild(this.component.body);
        this.component.show();

        // Execute
        await puppeteerWaitForFileChooser();
        chooseButton.click();
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/load_error.png",
          __dirname + "/golden/load_error.png",
          __dirname + "/load_error_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "Upload";
      private component: ChangeAvatarComponent;
      public async execute() {
        // Prepare
        document.body.style.width = "1000px";
        let uploadButton = FillButtonComponent.create(true, E.text("Upload"));
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
        this.component = new ChangeAvatarComponent(
          new (class extends AvatarCanvasComponentMock {
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
          OutlineButtonComponent.create(true, E.text("Choose an image file")),
          uploadButton,
          clientMock
        ).init();
        document.body.appendChild(this.component.body);
        this.component.show();

        // Execute
        await uploadButton.click();

        // Verify
        assertThat(clientMock.counter.get("send"), eq(1), "send times");
        await asyncAssertScreenshot(
          __dirname + "/upload_error.png",
          __dirname + "/golden/upload_error.png",
          __dirname + "/upload_error_diff.png",
          { fullPage: true }
        );

        // Execute
        await uploadButton.click();

        // Verify
        assertThat(clientMock.counter.get("send"), eq(2), "send times");
        await asyncAssertScreenshot(
          __dirname + "/upload_success.png",
          __dirname + "/golden/upload_success.png",
          __dirname + "/upload_success_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
  ],
});
