import express = require("express");
import expressStaticGzip = require("express-static-gzip");
import http = require("http");
import { ExpiredPostEntryCleaner } from "./cleaner/expired_post_entry_cleaner";
import { ConsoleLogger, LOGGER, RemoteLogger } from "./common/logger";
import { PostEntryRedisCounter } from "./common/post_entry_redis_counter";
import { createRedisClients } from "./common/redis_clients";
import { PostEntryCounterFlusher } from "./flusher/post_entry_count_flusher";
import { CreatePostHandler } from "./handler/create_post_handler";
import { ReactToPostHandler } from "./handler/react_to_post_handler";
import { ReadPostsHandler } from "./handler/read_posts_handler";
import { SignInHandler } from "./handler/sign_in_handler";
import { SignUpHandler } from "./handler/sign_up_handler";
import { HandlerRegister } from "@selfage/service_handler/handler_register";
import { SessionSigner } from "@selfage/service_handler/session_signer";
import "../environment";
import "@selfage/web_app_base_dir";

async function main(): Promise<void> {
  if (globalThis.ENVIRONMENT === "dev") {
    RemoteLogger.create();
    createRedisClients(`10.150.129.188:6379`);
    PostEntryRedisCounter.create();
    PostEntryCounterFlusher.create();
    ExpiredPostEntryCleaner.create();

    let app = express();
    registerHandlers(app, "randomlocalkey");
    registerWebApps(app);
    let httpServer = http.createServer(app);
    httpServer.listen(80, () => {
      LOGGER.info("Http server started at 80.");
    });
  } else if (globalThis.ENVIRONMENT === "local") {
    ConsoleLogger.create();

    let app = express();
    registerWebApps(app);
    let httpServer = http.createServer(app);
    httpServer.listen(8080, () => {
      LOGGER.info("Http server started at 8080.");
    });
  } else {
    throw new Error(`Not supported environment ${globalThis.ENVIRONMENT}.`);
  }
}

function registerHandlers(app: express.Express, sessionKey: string): void {
  SessionSigner.SECRET_KEY = sessionKey;
  let register = new HandlerRegister(app, LOGGER);
  register.registerCorsAllowedPreflightHandler();
  register.registerUnauthed(SignInHandler.create());
  register.registerUnauthed(SignUpHandler.create());
  register.registerAuthed(CreatePostHandler.create());
  register.registerAuthed(ReadPostsHandler.create());
  register.registerAuthed(ReactToPostHandler.create());
}

function registerWebApps(app: express.Express): void {
  app.get("/*", (req, res, next) => {
    LOGGER.info(`Received GET request at ${req.originalUrl}.`);
    next();
  });
  app.use(
    "/",
    expressStaticGzip(globalThis.WEB_APP_BASE_DIR, {
      serveStatic: {
        extensions: ["html"],
        fallthrough: false,
      },
    })
  );
}

main();
