import wideImage = require("./test_data/wide.jpeg");
import { CREATE_TALE_REQUEST_BODY } from "../../../../interface/tale_service";
import { WarningTagType } from "../../../../interface/warning_tag_type";
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
      public name = "RenderWide";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new WriteTalePage(new QuickLayoutEditorMock(), undefined);
        this.container = E.div(
          {},
          cut.body,
          E.div(
            {
              style: "position: fixed; right: 0; top: 0;",
            },
            cut.menuBody
          )
        );
        await puppeteerSetViewport(1300, 600);
        document.body.append(this.container);

        // Execute
        cut.show();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_render_wide.png",
          __dirname + "/golden/write_tale_page_render_wide.png",
          __dirname + "/write_tale_page_render_wide_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
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
        let cut = new WriteTalePage(quickLayoutEditorMock, serviceClientMock);
        this.container = E.div(
          {},
          cut.body,
          E.div(
            {
              style: "position: fixed; right: 0; top: 0;",
            },
            cut.menuBody
          )
        );
        await puppeteerSetViewport(1000, 600);
        document.body.append(this.container);

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
        cut.tagInput.value = "some tag";
        cut.addTagButton.click();
        cut.tagInput.value = "tag 2";
        cut.addTagButton.click();
        cut.tagInput.value = "tag 3";
        cut.addTagButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_add_tags.png",
          __dirname + "/golden/write_tale_page_add_tags.png",
          __dirname + "/write_tale_page_add_tags_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.tags[0].deleteButton.click();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/write_tale_page_remove_tag.png",
          __dirname + "/golden/write_tale_page_remove_tag.png",
          __dirname + "/write_tale_page_remove_tag_diff.png",
          { fullPage: true }
        );

        // Execute
        cut.warningTagGross.body.click();

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
        await cut.submitButton.click();

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
        await cut.submitButton.click();

        // Verify
        assertThat(
          requestCaptured.request.body,
          eqMessage(
            {
              quickLayout: {
                text: "",
                images: [wideImage],
              },
              tags: ["tag 2", "tag 3"],
              warningTags: [WarningTagType.Gross],
            },
            CREATE_TALE_REQUEST_BODY
          ),
          "submitTale request"
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
