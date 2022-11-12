import { normalizeBody } from "../../../common/normalize_body";
import { QuickLayoutEditor } from "./container";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";

normalizeBody();

TEST_RUNNER.run({
  name: "QuickLayoutEditorTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: QuickLayoutEditor;
      public async execute() {
        // Prepare
        this.cut = new QuickLayoutEditor();
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
        this.cut = new QuickLayoutEditor();
        document.body.style.display = "flex";
        document.body.style.flexFlow = "column nowrap";
        document.body.style.width = "800px";
        document.body.append(...this.cut.bodies);
        let uploadButton = document.body.querySelector(
          ".quick-layout-upload-image-button"
        );

        // Execute
        await puppeteerWaitForFileChooser();
        uploadButton.dispatchEvent(new MouseEvent("click"));
        await puppeteerFileChooserAccept(__dirname + "/test_data/wide.jpeg");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/upload_first_image_to_quick_layout_editor.png",
          __dirname + "/golden/upload_first_image_to_quick_layout_editor.png",
          __dirname + "/upload_first_image_to_quick_layout_editor_diff.png",
          { fullPage: true }
        );

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
        document.body
          .querySelectorAll(".image-editor-move-up-button")[1]
          .dispatchEvent(new MouseEvent("click"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/move_up_image_in_quick_layout_editor.png",
          __dirname + "/golden/move_up_image_in_quick_layout_editor.png",
          __dirname + "/move_up_image_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

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
        document.body
          .querySelectorAll(".image-editor-move-down-button")[0]
          .dispatchEvent(new MouseEvent("click"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/move_down_first_image_in_quick_layout_editor.png",
          __dirname +
            "/golden/move_down_first_image_in_quick_layout_editor.png",
          __dirname + "/move_down_first_image_in_quick_layout_editor_diff.png",
          { fullPage: true }
        );

        // Execute
        document.body
          .querySelectorAll(".image-editor-move-down-button")[1]
          .dispatchEvent(new MouseEvent("click"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/move_down_second_image_in_quick_layout_editor.png",
          __dirname +
            "/golden/move_down_second_image_in_quick_layout_editor.png",
          __dirname + "/move_down_second_image_in_quick_layout_editor_diff.png",
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
        this.cut = new QuickLayoutEditor();
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
  ],
});
