import path = require("path");
import { PostEntryCard } from "../../../../interface/post_entry_card";
import { normalizeBody } from "../../common/normalize_body";
import { PostEntryListComponent } from "./component";
import { PostEntryCardComponent } from "./post_entry_card/component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
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

        // Execute
        let component = new PostEntryListComponent((postEntryCard) => {
          return new PostEntryCardComponent(postEntryCard);
        }).init();
        document.body.appendChild(component.body);
        component.addEntries(generateCards(7));

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
        component.addEntries([
          { postEntryId: "2", ...CARD_TEMPLATE },
          { postEntryId: "5", ...CARD_TEMPLATE },
          ...generateCards(7),
        ]);
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
