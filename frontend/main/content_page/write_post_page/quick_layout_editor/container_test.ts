import tallImage = require("./test_data/tall.webp");
import wideImage = require("./test_data/wide.jpeg");
import { UploadImageForPostResponse } from "../../../../../interface/post_life_cycle_service";
import { normalizeBody } from "../../../common/normalize_body";
import { QuickLayoutEditor } from "./container";
import { ImageEditorMock } from "./mocks";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";

normalizeBody();

TEST_RUNNER.run({
  name: "QuickLayoutEditorTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: QuickLayoutEditor;
      public async execute() {
        // Prepare
        this.cut = new QuickLayoutEditor(
          (imageUrl) => new ImageEditorMock(imageUrl),
          undefined
        );
        document.body.style.display = "flex";
        document.body.style.flexFlow = "column nowrap";
        document.body.style.width = "800px";

        // Execute
        document.body.append(...this.cut.bodies);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_quick_layout_editor.png",
          __dirname + "/golden/render_quick_layout_editor.png",
          __dirname + "/render_quick_layout_editor_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        if (this.cut) {
          for (let div of this.cut.bodies) {
            div.remove();
          }
        }
      }
    })(),
    new (class implements TestCase {
      public name = "UploadAndMoveImages";
      private cut: QuickLayoutEditor;
      public async execute() {
        // Prepare
        let serviceClientMock = new (class extends WebServiceClient {
          public imageToReturn: string;
          public errorToThrow: Error;
          public constructor() {
            super(undefined, undefined);
          }
          public async send(request: any): Promise<any> {
            if (this.errorToThrow) {
              throw this.errorToThrow;
            }
            return { url: this.imageToReturn } as UploadImageForPostResponse;
          }
        })();
        let imageEditorMocks = new Array<ImageEditorMock>();
        this.cut = new QuickLayoutEditor((imageUrl) => {
          imageEditorMocks.push(new ImageEditorMock(imageUrl));
          return imageEditorMocks[imageEditorMocks.length - 1];
        }, serviceClientMock);
        let valid = false;
        this.cut.on("valid", () => (valid = true));
        this.cut.on("invalid", () => (valid = false));
        document.body.style.display = "flex";
        document.body.style.flexFlow = "column nowrap";
        document.body.style.width = "800px";
        document.body.append(...this.cut.bodies);
        let uploadButton = document.body.querySelector(
          ".quick-layout-upload-image-button"
        );
        serviceClientMock.errorToThrow = new Error("Some error");

        // Execute
        await puppeteerWaitForFileChooser();
        uploadButton.dispatchEvent(new MouseEvent("click"));
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/upload_image_error_in_quick_layout_editor.png",
          __dirname + "/golden/upload_image_error_in_quick_layout_editor.png",
          __dirname + "/upload_image_error_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Prepare
        serviceClientMock.errorToThrow = undefined;
        serviceClientMock.imageToReturn = wideImage;

        // Execute
        await puppeteerWaitForFileChooser();
        uploadButton.dispatchEvent(new MouseEvent("click"));
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Verify
        assertThat(valid, eq(true), "valid");
        assertThat(this.cut.valid, eq(true), "cut valid");
        await asyncAssertScreenshot(
          __dirname + "/upload_first_image_to_quick_layout_editor.png",
          __dirname + "/golden/upload_first_image_to_quick_layout_editor.png",
          __dirname + "/upload_first_image_to_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Prepare
        serviceClientMock.imageToReturn = tallImage;

        // Execute
        await puppeteerWaitForFileChooser();
        uploadButton.dispatchEvent(new MouseEvent("click"));
        await puppeteerFileChooserAccept(__dirname + "/test_data/tall.webp");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/upload_second_image_to_quick_layout_editor.png",
          __dirname + "/golden/upload_second_image_to_quick_layout_editor.png",
          __dirname + "/upload_second_image_to_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Execute
        imageEditorMocks[1].moveUp();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/move_up_image_in_quick_layout_editor.png",
          __dirname + "/golden/move_up_image_in_quick_layout_editor.png",
          __dirname + "/move_up_image_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Prepare
        serviceClientMock.imageToReturn = wideImage;

        // Execute
        await puppeteerWaitForFileChooser();
        uploadButton.dispatchEvent(new MouseEvent("click"));
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/upload_third_image_to_quick_layout_editor.png",
          __dirname + "/golden/upload_third_image_to_quick_layout_editor.png",
          __dirname + "/upload_third_image_to_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Execute
        imageEditorMocks[1].moveDown();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/move_down_first_image_in_quick_layout_editor.png",
          __dirname +
            "/golden/move_down_first_image_in_quick_layout_editor.png",
          __dirname + "/move_down_first_image_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Execute
        imageEditorMocks[1].moveDown();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/move_down_second_image_in_quick_layout_editor.png",
          __dirname +
            "/golden/move_down_second_image_in_quick_layout_editor.png",
          __dirname + "/move_down_second_image_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Execute
        for (let i = 0; i < 6; i++) {
          await puppeteerWaitForFileChooser();
          uploadButton.dispatchEvent(new MouseEvent("click"));
          await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");
        }

        // Verify
        assertThat(valid, eq(true), "valid 9");
        assertThat(this.cut.valid, eq(true), "cut valid 9");
        await asyncAssertScreenshot(
          __dirname + "/upload_9_images_in_quick_layout_editor.png",
          __dirname + "/golden/upload_9_images_in_quick_layout_editor.png",
          __dirname + "/upload_9_images_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Execute
        imageEditorMocks[1].delete();

        // Verify
        assertThat(valid, eq(true), "valid 8");
        assertThat(this.cut.valid, eq(true), "cut valid 8");
        await asyncAssertScreenshot(
          __dirname + "/delete_image_in_quick_layout_editor.png",
          __dirname + "/golden/delete_image_in_quick_layout_editor.png",
          __dirname + "/delete_image_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Execute
        imageEditorMocks.forEach((imageEditorMock) => imageEditorMock.delete());

        // Verify
        assertThat(valid, eq(false), "invalid");
        assertThat(this.cut.valid, eq(false), "cut invalid");
        await asyncAssertScreenshot(
          __dirname + "/delete_all_images_in_quick_layout_editor.png",
          __dirname + "/golden/delete_all_images_in_quick_layout_editor.png",
          __dirname + "/delete_all_images_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        if (this.cut) {
          for (let div of this.cut.bodies) {
            div.remove();
          }
        }
      }
    })(),
    new (class implements TestCase {
      public name = "CountCharacter";
      private cut: QuickLayoutEditor;
      public async execute() {
        // Prepare
        this.cut = new QuickLayoutEditor(undefined, undefined);
        let valid = false;
        this.cut.on("valid", () => (valid = true));
        this.cut.on("invalid", () => (valid = false));
        document.body.style.display = "flex";
        document.body.style.flexFlow = "column nowrap";
        document.body.style.width = "800px";
        document.body.append(...this.cut.bodies);
        let textArea = document.body.querySelector(
          ".quick-layout-text-input"
        ) as HTMLTextAreaElement;

        // Execute
        textArea.value = "some something";
        textArea.dispatchEvent(new KeyboardEvent("input"));

        // Verify
        assertThat(valid, eq(true), "valid");
        assertThat(this.cut.valid, eq(true), "cut valid");
        await asyncAssertScreenshot(
          __dirname + "/count_character_in_quick_layout_editor.png",
          __dirname + "/golden/count_character_in_quick_layout_editor.png",
          __dirname + "/count_character_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Execute
        let characters = new Array<string>();
        for (let i = 0; i < 701; i++) {
          characters.push("c");
        }
        textArea.value = characters.join("");
        textArea.dispatchEvent(new KeyboardEvent("input"));

        // Verify
        assertThat(valid, eq(false), "invalid");
        assertThat(this.cut.valid, eq(false), "cut invalid");
        await asyncAssertScreenshot(
          __dirname + "/count_overflowed_character_in_quick_layout_editor.png",
          __dirname +
            "/golden/count_overflowed_character_in_quick_layout_editor.png",
          __dirname +
            "/count_overflowed_character_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        if (this.cut) {
          for (let div of this.cut.bodies) {
            div.remove();
          }
        }
      }
    })(),
    new (class implements TestCase {
      public name = "ValidAfterCleanText";
      private cut: QuickLayoutEditor;
      public async execute() {
        // Prepare
        let imageEditorMock: ImageEditorMock;
        this.cut = new QuickLayoutEditor(
          (imageUrl) => {
            imageEditorMock = new ImageEditorMock(imageUrl);
            return imageEditorMock;
          },
          new (class extends WebServiceClient {
            public constructor() {
              super(undefined, undefined);
            }
            public async send(request: any): Promise<any> {
              return { url: wideImage } as UploadImageForPostResponse;
            }
          })()
        );
        let valid = false;
        this.cut.on("valid", () => (valid = true));
        this.cut.on("invalid", () => (valid = false));
        document.body.append(...this.cut.bodies);
        let textArea = document.body.querySelector(
          ".quick-layout-text-input"
        ) as HTMLTextAreaElement;
        textArea.value = "some something";
        textArea.dispatchEvent(new KeyboardEvent("input"));
        let uploadButton = document.body.querySelector(
          ".quick-layout-upload-image-button"
        );
        await puppeteerWaitForFileChooser();
        uploadButton.dispatchEvent(new MouseEvent("click"));
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");
        assertThat(valid, eq(true), "precheck valid");
        assertThat(this.cut.valid, eq(true), "cut precheck valid");

        // Execute
        textArea.value = "";
        textArea.dispatchEvent(new KeyboardEvent("input"));

        // Verify
        assertThat(valid, eq(true), "valid");
        assertThat(this.cut.valid, eq(true), "cut valid");

        // Execute
        imageEditorMock.delete();

        // Verify
        assertThat(valid, eq(false), "invalid");
        assertThat(this.cut.valid, eq(false), "cut invalid");
      }
      public tearDown() {
        if (this.cut) {
          for (let div of this.cut.bodies) {
            div.remove();
          }
        }
      }
    })(),
    new (class implements TestCase {
      public name = "ValidAfterDeleteImages";
      private cut: QuickLayoutEditor;
      public async execute() {
        // Prepare
        let imageEditorMock: ImageEditorMock;
        this.cut = new QuickLayoutEditor(
          (imageUrl) => {
            imageEditorMock = new ImageEditorMock(imageUrl);
            return imageEditorMock;
          },
          new (class extends WebServiceClient {
            public constructor() {
              super(undefined, undefined);
            }
            public async send(request: any): Promise<any> {
              return { url: wideImage } as UploadImageForPostResponse;
            }
          })()
        );
        let valid = false;
        this.cut.on("valid", () => (valid = true));
        this.cut.on("invalid", () => (valid = false));
        document.body.append(...this.cut.bodies);
        let textArea = document.body.querySelector(
          ".quick-layout-text-input"
        ) as HTMLTextAreaElement;
        textArea.value = "some something";
        textArea.dispatchEvent(new KeyboardEvent("input"));
        let uploadButton = document.body.querySelector(
          ".quick-layout-upload-image-button"
        );
        await puppeteerWaitForFileChooser();
        uploadButton.dispatchEvent(new MouseEvent("click"));
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");
        assertThat(valid, eq(true), "precheck valid");
        assertThat(this.cut.valid, eq(true), "cut precheck valid");

        // Execute
        imageEditorMock.delete();

        // Verify
        assertThat(valid, eq(true), "valid");
        assertThat(this.cut.valid, eq(true), "cut valid");

        // Execute
        textArea.value = "";
        textArea.dispatchEvent(new KeyboardEvent("input"));

        // Verify
        assertThat(valid, eq(false), "invalid");
        assertThat(this.cut.valid, eq(false), "cut invalid");
      }
      public tearDown() {
        if (this.cut) {
          for (let div of this.cut.bodies) {
            div.remove();
          }
        }
      }
    })(),
    new (class implements TestCase {
      public name = "Clear";
      private cut: QuickLayoutEditor;
      public async execute() {
        // Prepare
        this.cut = new QuickLayoutEditor(
          (imageUrl) => new ImageEditorMock(imageUrl),
          new (class extends WebServiceClient {
            public constructor() {
              super(undefined, undefined);
            }
            public async send(request: any): Promise<any> {
              return { url: wideImage } as UploadImageForPostResponse;
            }
          })()
        );
        document.body.append(...this.cut.bodies);
        let textArea = document.body.querySelector(
          ".quick-layout-text-input"
        ) as HTMLTextAreaElement;
        textArea.value = "some something";
        textArea.dispatchEvent(new KeyboardEvent("input"));
        let uploadButton = document.body.querySelector(
          ".quick-layout-upload-image-button"
        );
        await puppeteerWaitForFileChooser();
        uploadButton.dispatchEvent(new MouseEvent("click"));
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");
        assertThat(this.cut.valid, eq(true), "cut precheck valid");

        // Execute
        this.cut.clear();

        // Verify
        assertThat(this.cut.textInput.value, eq(""), "text");
        assertThat(this.cut.imageEditors.length, eq(0), "images");
        assertThat(this.cut.valid, eq(false), "cut invalid");
      }
      public tearDown() {
        if (this.cut) {
          for (let div of this.cut.bodies) {
            div.remove();
          }
        }
      }
    })(),
  ],
});
