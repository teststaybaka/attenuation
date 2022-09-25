import { ORIGIN_DEV } from "../../constants";
import { BodyController } from "./body_controller";
import { normalizeBody } from "./common/normalize_body";
import { WEB_SERVICE_CLIENT } from "./common/web_service_client";
import { CONTENT_STATE } from "./content_page/state";
import { createLoaderAndUpdater } from "@selfage/stateful_navigator";
import "../../environment";

async function main(): Promise<void> {
  normalizeBody();
  let viewPortMeta = document.createElement("meta");
  viewPortMeta.name = "viewport";
  viewPortMeta.content = "width=device-width, initial-scale=1";
  document.head.appendChild(viewPortMeta);

  if (globalThis.ENVIRONMENT === "dev") {
    WEB_SERVICE_CLIENT.origin = ORIGIN_DEV;
  } else if (globalThis.ENVIRONMENT === "local") {
    WEB_SERVICE_CLIENT.origin = ORIGIN_DEV;
  } else {
    throw new Error(`Not supported environment ${globalThis.ENVIRONMENT}.`);
  }

  let queryParamKeyForState = "q";
  let [loader] = createLoaderAndUpdater(CONTENT_STATE, queryParamKeyForState);
  BodyController.create(document.body, loader.state);
}

main();
