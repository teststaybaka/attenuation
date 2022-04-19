import express = require("express");
import expressStaticGzip = require("express-static-gzip");
import http = require("http");
import { ConsoleLogger, LOGGER, RemoteLogger } from "./common/logger";
import { createRedisClients } from "./common/redis_clients";
import { CreatePostHandler } from "./handler/create_post_handler";
import { ReactToPostHandler } from "./handler/react_to_post_handler";
import { ReadPostsHandler } from "./handler/read_posts_handler";
import { SignInHandler } from "./handler/sign_in_handler";
import { SignUpHandler } from "./handler/sign_up_handler";
import { PostEntryCountFlusher } from "./reducer/post_entry_count_flusher";
import { HandlerRegister } from "@selfage/service_handler/handler_register";
import { SessionSigner } from "@selfage/service_handler/session_signer";
import "../environment";
import "@selfage/web_app_base_dir";

async function main(): Promise<void> {
  if (globalThis.ENVIRONMENT === "dev") {
    RemoteLogger.create();
    createRedisClients(`10.150.129.188:6379`);

    let app = registerHandlers("randomlocalkey");
    let httpServer = http.createServer(app);
    httpServer.listen(80, () => {
      LOGGER.info("Http server started at 80.");
    });

    PostEntryCountFlusher.create();
  } else if (globalThis.ENVIRONMENT === "local") {
    ConsoleLogger.create();
    createRedisClients(`10.150.129.188:6379`);

    let app = registerHandlers("randomlocalkey");
    let httpServer = http.createServer(app);
    httpServer.listen(8080, () => {
      LOGGER.info("Http server started at 8080.");
    });

    PostEntryCountFlusher.create();
  } else {
    throw new Error(`Not supported environment ${globalThis.ENVIRONMENT}.`);
  }
}

function registerHandlers(sessionKey: string): express.Express {
  SessionSigner.SECRET_KEY = sessionKey;
  let app = express();
  let register = new HandlerRegister(app, LOGGER);
  register.registerCorsAllowedPreflightHandler();
  register.registerUnauthed(SignInHandler.create());
  register.registerUnauthed(SignUpHandler.create());
  register.registerAuthed(CreatePostHandler.create());
  register.registerAuthed(ReadPostsHandler.create());
  register.registerAuthed(ReactToPostHandler.create());

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
  return app;
}

main();
