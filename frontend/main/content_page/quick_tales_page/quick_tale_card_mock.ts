import { QuickTaleCard as QuickTaleCardData } from "../../../../interface/tale_card";
import { QuickTaleCard } from "./quick_tale_card";

export class QuickTaleCardMock extends QuickTaleCard {
  public constructor(cardData: QuickTaleCardData, pinned: boolean) {
    super(cardData, pinned, undefined);
  }
}
