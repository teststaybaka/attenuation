import { ORIGIN_LOCAL } from "../../constants";
import { SERVICE_CLIENT } from "./service_client";
import "../../environment";

async function main(): Promise<void> {
  document.documentElement.style.fontSize = "62.5%";
  document.body.style.margin = "0";
  document.body.style.fontSize = "0";
  let viewPortMeta = document.createElement("meta");
  viewPortMeta.name = "viewport";
  viewPortMeta.content = "width=device-width, initial-scale=1";
  document.head.appendChild(viewPortMeta);

  if (globalThis.ENVIRONMENT === "local") {
    SERVICE_CLIENT.origin = ORIGIN_LOCAL;
  } else {
    throw new Error(`Not supported environment ${globalThis.ENVIRONMENT}.`);
  }
}

main();
