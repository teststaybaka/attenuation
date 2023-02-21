import { QuickTaleCard as QuickTaleCardData } from "../../../../../interface/tale_card";
import {
  GET_QUICK_TALE,
  GetQuickTaleResponse,
} from "../../../../../interface/tale_service";
import { WriteTalePage } from "./container";
import { QuickLayoutEditorMock } from "./quick_layout_editor/container_mock";
import { WebServiceClient } from "@selfage/web_service_client";

export class WriteTalePageMock extends WriteTalePage {
  public constructor(pinnedTaleId: string, taleCardData?: QuickTaleCardData) {
    super(
      pinnedTaleId,
      new QuickLayoutEditorMock(),
      new (class extends WebServiceClient {
        public constructor() {
          super(undefined, undefined);
        }
        public send(request: any): any {
          if (request.descriptor === GET_QUICK_TALE) {
            return { card: taleCardData } as GetQuickTaleResponse;
          }
        }
      })()
    );
  }
}
