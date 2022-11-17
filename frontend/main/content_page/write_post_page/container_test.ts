import wideImage = require("./test_data/wide.jpeg");
import { CREATE_POST_REQUEST_BODY } from "../../../../interface/post_life_cycle_service";
import { WarningTagType } from "../../../../interface/warning_tag_type";
import { FillButton, OutlineButton } from "../../common/button";
import { normalizeBody } from "../../common/normalize_body";
import { WritePostPage } from "./container";
import { QuickLayoutEditorMock } from "./quick_layout_editor/mocks";
import { E } from "@selfage/element/factory";
import { eqMessage } from "@selfage/message/test_matcher";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";

normalizeBody();

TEST_RUNNER.run({
  name: "WritePostPageTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderAndSubmit";
      private cut: WritePostPage;
      public async execute() {
        // Prepare
        let quickLayoutEditorMock = new QuickLayoutEditorMock();
        let requestCaptured: any;
        let serviceClientMock = new (class extends WebServiceClient {
          public errorToThrow: Error;
          public constructor() {
            super(undefined, undefined);
          }
          public send(request: any): any {
            if (this.errorToThrow) {
              throw this.errorToThrow;
            }
            requestCaptured = request;
          }
        })();
        let submitButton = FillButton.create(false, E.text("Submit your post"));
        this.cut = new WritePostPage(
          quickLayoutEditorMock,
          OutlineButton.create(false, E.text("Preview")),
          submitButton,
          serviceClientMock
        );
        document.body.append(this.cut.body);
        await puppeteerSetViewport(1000, 600);
        let tagInput = document.body.querySelector(
          ".write-post-add-tag-input"
        ) as HTMLInputElement;
        let addTagButton = document.body.querySelector(
          ".write-post-add-tag-button"
        ) as HTMLButtonElement;

        // Execute
        this.cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_write_post_page.png",
          __dirname + "/golden/render_write_post_page.png",
          __dirname + "/render_write_post_page_diff.png",
          { fullPage: true }
        );

        // Execute
        quickLayoutEditorMock.addImage(wideImage);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/upload_first_image_in_write_post_page.png",
          __dirname + "/golden/upload_first_image_in_write_post_page.png",
          __dirname + "/upload_first_image_in_write_post_page_diff.png",
          { fullPage: true }
        );

        // Execute
        tagInput.value = "some tag";
        addTagButton.click();
        tagInput.value = "tag 2";
        addTagButton.click();
        tagInput.value = "tag 3";
        addTagButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/add_tags_in_write_post_page.png",
          __dirname + "/golden/add_tags_in_write_post_page.png",
          __dirname + "/add_tags_in_write_post_page_diff.png",
          { fullPage: true }
        );

        // Execute
        document.body
          .querySelectorAll(".normal-tag-delete-button")[0]
          .dispatchEvent(new MouseEvent("click"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/remove_tag_in_write_post_page.png",
          __dirname + "/golden/remove_tag_in_write_post_page.png",
          __dirname + "/remove_tag_in_write_post_page_diff.png",
          { fullPage: true }
        );

        // Execute
        document.body
          .querySelectorAll(".warning-tag")[2]
          .dispatchEvent(new MouseEvent("click"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/add_warning_tag_in_write_post_page.png",
          __dirname + "/golden/add_warning_tag_in_write_post_page.png",
          __dirname + "/add_warning_tag_in_write_post_page_diff.png",
          { fullPage: true }
        );

        // Prepare
        serviceClientMock.errorToThrow = new Error("Some error");

        // Execute
        submitButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/submit_failure_in_write_post_page.png",
          __dirname + "/golden/submit_failure_in_write_post_page.png",
          __dirname + "/submit_failure_in_write_post_page_diff.png",
          { fullPage: true }
        );

        // Prepare
        serviceClientMock.errorToThrow = undefined;

        // Execute
        submitButton.click();

        // Verify
        assertThat(
          requestCaptured.request.body,
          eqMessage(
            {
              quickLayoutPost: {
                text: "",
                images: [wideImage],
              },
              tags: ["tag 2", "tag 3"],
              warningTags: [WarningTagType.Gross],
            },
            CREATE_POST_REQUEST_BODY
          ),
          "submitPost request"
        );
        await asyncAssertScreenshot(
          __dirname + "/after_submit_in_write_post_page.png",
          __dirname + "/golden/render_write_post_page.png",
          __dirname + "/after_submit_in_write_post_page_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.cut.body.remove();
      }
    })(),
  ],
});
