import { ORIGIN_DEV } from "../../constants";
import { MAIN_CONTENT_STATE } from "./main_content/state";
import { MainController } from "./main_controller";
import { SERVICE_CLIENT } from "./service_client";
import { createLoaderAndUpdater } from "@selfage/stateful_navigator";
import "../../environment";

async function main(): Promise<void> {
  document.documentElement.style.fontSize = "62.5%";
  document.body.style.margin = "0";
  document.body.style.fontSize = "0";
  let viewPortMeta = document.createElement("meta");
  viewPortMeta.name = "viewport";
  viewPortMeta.content = "width=device-width, initial-scale=1";
  document.head.appendChild(viewPortMeta);

  if (globalThis.ENVIRONMENT === "dev") {
    SERVICE_CLIENT.origin = ORIGIN_DEV;
  } else if (globalThis.ENVIRONMENT === "local") {
    SERVICE_CLIENT.origin = ORIGIN_DEV;
  } else {
    throw new Error(`Not supported environment ${globalThis.ENVIRONMENT}.`);
  }

  let queryParamKeyForState = "q";
  let [loader] = createLoaderAndUpdater(
    MAIN_CONTENT_STATE,
    queryParamKeyForState
  );
  MainController.create(document.body, loader.state);
}

main();
