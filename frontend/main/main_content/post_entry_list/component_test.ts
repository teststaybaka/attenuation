import path = require("path");
import { PostEntryCard } from "../../../../interface/post_entry_card";
import { normalizeBody } from "../../common/normalize_body";
import { PostEntryListComponent } from "./component";
import { PostEntryCardComponent } from "./post_entry_card/component";
import { Counter } from "@selfage/counter";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { ServiceClient } from "@selfage/service_client";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_test_executor_api";

normalizeBody();

let CARD_TEMPLATE = {
  userProfilePicture: path.join(__dirname, "../common/user_image.jpg"),
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

PUPPETEER_TEST_RUNNER.run({
  name: "PostEntryListComponentTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Prepare
        document.body.style.width = "1000px";
        document.body.style.height = "600px";
        let component = new PostEntryListComponent(
          (postEntryCard) => {
            return new PostEntryCardComponent(postEntryCard);
          },
          new (class extends ServiceClient {
            public counter = new Counter<string>();
            public constructor() {
              super(undefined, undefined);
            }
            public async fetchAuthed<T>(): Promise<any> {
              switch (this.counter.increment("fetchAuthed")) {
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
        component.show();

        // Execute
        document.body.appendChild(component.body);
        component.refresh();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_narrow.png",
          __dirname + "/golden/render_component_narrow.png",
          __dirname + "/render_component_narrow_diff.png",
          { fullPage: true }
        );

        // Execute
        document.body.style.width = "1400px";

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_medium.png",
          __dirname + "/golden/render_component_medium.png",
          __dirname + "/render_component_medium_diff.png",
          { fullPage: true }
        );

        // Execute
        component.refresh();
        document.body.style.width = "2000px";

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/render_component_wide.png",
          __dirname + "/golden/render_component_wide.png",
          __dirname + "/render_component_wide_diff.png",
          { fullPage: true }
        );
      },
      tearDown: () => {
        if (document.body.lastChild) {
          document.body.removeChild(document.body.lastChild);
        }
      },
    },
  ],
});
