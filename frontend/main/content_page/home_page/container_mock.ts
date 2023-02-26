import { QuickTaleCard as QuickTaleCardData } from "../../../../interface/tale_card";
import { HomePage } from "./container";
import {
  QuickTalesPageMock,
  QuickTalesPageMockData,
} from "./quick_tales_page/container_mock";
import { WriteTalePageMock } from "./write_tale_page/container_mock";

export class HomePageMock extends HomePage {
  public constructor(
    appendBodiesFn: (bodies: Array<HTMLElement>) => void,
    prependMenuBodiesFn: (menuBodies: Array<HTMLElement>) => void,
    appendMenuBodiesFn: (menuBodies: Array<HTMLElement>) => void,
    appendControllerBodiesFn: (controllerBodies: Array<HTMLElement>) => void,
    quickTalesPageMockData: QuickTalesPageMockData,
    writeTalePageCardData?: QuickTaleCardData
  ) {
    super(
      appendBodiesFn,
      prependMenuBodiesFn,
      appendMenuBodiesFn,
      appendControllerBodiesFn,
      (taleId) => new WriteTalePageMock(taleId, writeTalePageCardData),
      (
        context,
        appendBodiesFn,
        prependMenuBodiesFn,
        appendMenuBodiesFn,
        appendControllerBodiesFn
      ) =>
        new QuickTalesPageMock(
          context,
          appendBodiesFn,
          prependMenuBodiesFn,
          appendMenuBodiesFn,
          appendControllerBodiesFn,
          quickTalesPageMockData
        )
    );
  }
}
