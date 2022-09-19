import path = require("path");
import { PostEntryCard } from "../../../../interface/post_entry_card";
import { normalizeBody } from "../../common/normalize_body";
import { PostEntryListComponent } from "./component";
import { PostEntryCardComponent } from "./post_entry_card/component";
import { Counter } from "@selfage/counter";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { WebServiceRequest } from "@selfage/service_descriptor";
import { TEST_RUNNER, TestCase } from "@selfage/test_runner";
import { WebServiceClient } from "@selfage/web_service_client";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

let CARD_TEMPLATE: PostEntryCard = {
  avatarSmallPath: path.join(__dirname, "../common/user_image.jpg"),
  username: "some-name",
  userNatureName: "Some Name",
  content: "blahblahblahblah\nsomethingsomething",
  createdTimestamp: Date.parse("2022-10-11"),
};

let cardId = 0;

function generateCards(num: number): Array<PostEntryCard> {
  let cards = new Array<PostEntryCard>();
  for (let i = 0; i < num; i++) {
    cards.push({ postEntryId: `${cardId++}`, ...CARD_TEMPLATE });
  }
  return cards;
}

TEST_RUNNER.run({
  name: "PostEntryListComponentTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private component: PostEntryListComponent;
      public async execute() {
        // Prepare
        await puppeteerSetViewport(1000, 600);
        document.body.style.width = "100vw";
        this.component = new PostEntryListComponent(
          (postEntryCard) => {
            return new PostEntryCardComponent(postEntryCard);
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
        ).init();
        this.component.show();

        // Execute
        document.body.appendChild(this.component.body);
        this.component.refresh();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_narrow.png",
          __dirname + "/golden/render_component_narrow.png",
          __dirname + "/render_component_narrow_diff.png",
          { threshold: 0.05 }
        );

        // Execute
        await puppeteerSetViewport(1400, 600);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_medium.png",
          __dirname + "/golden/render_component_medium.png",
          __dirname + "/render_component_medium_diff.png",
          { threshold: 0.05 }
        );

        // Execute
        this.component.refresh();
        await puppeteerSetViewport(2000, 600);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_wide.png",
          __dirname + "/golden/render_component_wide.png",
          __dirname + "/render_component_wide_diff.png",
          { threshold: 0.05 }
        );
      }
      public tearDown() {
        this.component.body.remove();
      }
    })(),
  ],
});
