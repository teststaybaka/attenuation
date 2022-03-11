import express = require("express");
import expressStaticGzip = require("express-static-gzip");
import http = require("http");
import { SignInHandler } from "./handler/sign_in_handler";
import { SignUpHandler } from "./handler/sign_up_handler";
import { ExpiredPostEntriesCleaner } from "./pubsub/expired_post_entries_cleaner";
import { registerCorsAllowedPreflightHandler } from "@selfage/service_handler/preflight_handler";
import { registerUnauthed } from "@selfage/service_handler/register";
import { SessionSigner } from "@selfage/service_handler/session_signer";
import "../environment";
import "@selfage/web_app_base_dir";

async function main(): Promise<void> {
  if (globalThis.ENVIRONMENT === "local") {
    let app = registerHandlers("randomlocalkey");
    let httpServer = http.createServer(app);
    httpServer.listen(8080, () => {
      console.log("Http server started at 8080.");
    });
    startSubscribers();
  } else {
    throw new Error(`Not supported environment ${globalThis.ENVIRONMENT}.`);
  }
}

function registerHandlers(sessionKey: string): express.Express {
  SessionSigner.SECRET_KEY = sessionKey;
  let app = express();
  registerCorsAllowedPreflightHandler(app);
  registerUnauthed(app, SignInHandler.create());
  registerUnauthed(app, SignUpHandler.create());
  app.use(
    "/",
    expressStaticGzip(globalThis.WEB_APP_BASE_DIR, {
      serveStatic: {
        extensions: ["html"],
        fallthrough: false,
      },
    })
  );
  return app;
}

function startSubscribers(): void {
  ExpiredPostEntriesCleaner.create();
}

main();
