import userImage = require("../common/user_image.jpg");
import { PostEntryCard as PostEntry } from "../../../../interface/post_entry_card";
import { normalizeBody } from "../../common/normalize_body";
import { PostEntryListPage } from "./container";
import { PostEntryCard } from "./post_entry_card";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { WebServiceRequest } from "@selfage/service_descriptor";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

let CARD_TEMPLATE: PostEntry = {
  avatarSmallPath: userImage,
  username: "some-name",
  userNatureName: "Some Name",
  content: "blahblahblahblah\nsomethingsomething",
  createdTimestamp: Date.parse("2022-10-11"),
};

let cardId = 0;

function generateCards(num: number): Array<PostEntry> {
  let cards = new Array<PostEntry>();
  for (let i = 0; i < num; i++) {
    cards.push({ postEntryId: `${cardId++}`, ...CARD_TEMPLATE });
  }
  return cards;
}

TEST_RUNNER.run({
  name: "PostEntryListPageTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private container: HTMLDivElement;
      public async execute() {
        // Prepare
        let cut = new PostEntryListPage(
          (postEntry) => {
            return new PostEntryCard(postEntry);
          },
          new (class extends WebServiceClient {
            public counter = new Counter<string>();
            public constructor() {
              super(undefined, undefined);
            }
            public async send(
              serviceRequest: WebServiceRequest<any, any>
            ): Promise<any> {
              switch (this.counter.increment("send")) {
                case 1:
                  return {
                    postEntryCards: generateCards(7),
                  };
                case 2:
                  return {
                    postEntryCards: [
                      // 10 should be a duplicated id.
                      { postEntryId: "10", ...CARD_TEMPLATE },
                      ...generateCards(14),
                      // 12 should be a duplicated id.
                      { postEntryId: "12", ...CARD_TEMPLATE },
                    ],
                  };
                default:
                  throw new Error("Fix test setup.");
              }
            }
          })()
        );
        await puppeteerSetViewport(1000, 600);
        this.container = E.div(
          {},
          E.div(
            {
              style: `position: fixed;`,
            },
            ...cut.menuBodies
          ),
          E.div(
            {
              style: `width: 100vw;`,
            },
            cut.body
          )
        );
        document.body.append(this.container);

        // Execute
        cut.show();
        await cut.refresh();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/post_entry_list_page_render_narrow.png",
          __dirname + "/golden/post_entry_list_page_render_narrow.png",
          __dirname + "/post_entry_list_page_render_narrow_diff.png",
          { threshold: 0.05 }
        );

        // Execute
        await puppeteerSetViewport(1400, 600);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/post_entry_list_page_render_medium.png",
          __dirname + "/golden/post_entry_list_page_render_medium.png",
          __dirname + "/post_entry_list_page_render_medium_diff.png",
          { threshold: 0.05 }
        );

        // Execute
        await cut.refresh();
        await puppeteerSetViewport(2000, 600);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/post_entry_list_page_render_wide.png",
          __dirname + "/golden/post_entry_list_page_render_wide.png",
          __dirname + "/post_entry_list_page_render_wide_diff.png",
          { threshold: 0.05 }
        );
      }
      public tearDown() {
        this.container.remove();
      }
    })(),
  ],
});
