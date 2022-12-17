import wideImage = require("./test_data/wide.jpeg");
import { CREATE_TALE_REQUEST_BODY } from "../../../../interface/tale_service";
import { WarningTagType } from "../../../../interface/warning_tag_type";
import { FillButton, OutlineButton } from "../../common/button";
import { normalizeBody } from "../../common/normalize_body";
import { WriteTalePage } from "./container";
import { QuickLayoutEditorMock } from "./quick_layout_editor/mocks";
import { E } from "@selfage/element/factory";
import { eqMessage } from "@selfage/message/test_matcher";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat } from "@selfage/test_matcher";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";

normalizeBody();

TEST_RUNNER.run({
  name: "WriteTalePageTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderAndSubmit";
      private container: HTMLDivElement;
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
        let cut = new WriteTalePage(
          quickLayoutEditorMock,
          OutlineButton.create(false, E.text("Preview")),
          submitButton,
          serviceClientMock
        );
        this.container = E.div({}, ...cut.bodies);
        document.body.append(this.container);
        await puppeteerSetViewport(1000, 600);
        let tagInput = document.body.querySelector(
          ".write-post-add-tag-input"
        ) as HTMLInputElement;
        let addTagButton = document.body.querySelector(
          ".write-post-add-tag-button"
        ) as HTMLButtonElement;

        // Execute
        cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_render.png",
          __dirname + "/golden/write_tale_page_render.png",
          __dirname + "/write_tale_page_render_diff.png",
          { fullPage: true }
        );

        // Execute
        quickLayoutEditorMock.addImage(wideImage);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_upload_first_image.png",
          __dirname + "/golden/write_tale_page_upload_first_image.png",
          __dirname + "/write_tale_page_upload_first_image_diff.png",
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
          __dirname + "/write_tale_page_add_tags.png",
          __dirname + "/golden/write_tale_page_add_tags.png",
          __dirname + "/write_tale_page_add_tags_diff.png",
          { fullPage: true }
        );

        // Execute
        document.body
          .querySelectorAll(".normal-tag-delete-button")[0]
          .dispatchEvent(new MouseEvent("click"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_remove_tag.png",
          __dirname + "/golden/write_tale_page_remove_tag.png",
          __dirname + "/write_tale_page_remove_tag_diff.png",
          { fullPage: true }
        );

        // Execute
        document.body
          .querySelectorAll(".warning-tag")[2]
          .dispatchEvent(new MouseEvent("click"));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_add_warning_tag.png",
          __dirname + "/golden/write_tale_page_add_warning_tag.png",
          __dirname + "/write_tale_page_add_warning_tag_diff.png",
          { fullPage: true }
        );

        // Prepare
        serviceClientMock.errorToThrow = new Error("Some error");

        // Execute
        submitButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_submit_failure.png",
          __dirname + "/golden/write_tale_page_submit_failure.png",
          __dirname + "/write_tale_page_submit_failure_diff.png",
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
              quickLayoutTale: {
                text: "",
                images: [wideImage],
              },
              tags: ["tag 2", "tag 3"],
              warningTags: [WarningTagType.Gross],
            },
            CREATE_TALE_REQUEST_BODY
          ),
          "submitPost request"
        );
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_after_submit.png",
          __dirname + "/golden/write_tale_page_after_submit.png",
          __dirname + "/write_tale_page_after_submit_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
