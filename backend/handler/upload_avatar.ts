import getStream = require("get-stream");
import sharp = require("sharp");
import stream = require("stream");
import util = require("util");
import { UploadAvatarResponse } from "../../interface/service";
import { STORAGE } from "../common/cloud_storage";
import { LOGGER } from "../common/logger";
import { CORE_DATABASE } from "../common/spanner_database";
import {
  UploadAvatarHandlerInterface,
  UploadAvatarHandlerRequest,
} from "./interfaces";
import { buildUpdateUserAvatarStatement } from "./users_sql";
import { Database } from "@google-cloud/spanner";
import { Storage } from "@google-cloud/storage";
import { newInternalServerErrorError } from "@selfage/http_error";
let pipeline = util.promisify(stream.pipeline);

export class UploadAvatarHandler extends UploadAvatarHandlerInterface {
  private static MAX_BUFFER_SIZE = 50 * 1024 * 1024; // 50 Mbi;
  private static LARGE_FILE_NAME = "pic_160_160";
  private static SMALL_FILE_NAME = "pic_50_50";

  public constructor(
    private coreDatabase: Database,
    private cloudStorage: Storage,
    private bucketName: string
  ) {
    super();
  }

  public static create(bucketName: string): UploadAvatarHandler {
    return new UploadAvatarHandler(CORE_DATABASE, STORAGE, bucketName);
  }

  public async handle(
    request: UploadAvatarHandlerRequest
  ): Promise<UploadAvatarResponse> {
    let pictureBuffer = await getStream.buffer(request.body, {
      maxBuffer: UploadAvatarHandler.MAX_BUFFER_SIZE,
    });

    LOGGER.info(
      `Request ${request.requestId}: Start processing the profile picture for user ${request.userSession.userId}...`
    );
    try {
      await Promise.all([
        this.resizeAndUpload(
          pictureBuffer,
          160,
          160,
          `${request.userSession.userId}/${UploadAvatarHandler.LARGE_FILE_NAME}`
        ),
        this.resizeAndUpload(
          pictureBuffer,
          50,
          50,
          `${request.userSession.userId}/${UploadAvatarHandler.SMALL_FILE_NAME}`
        ),
      ]);
    } catch (e) {
      throw newInternalServerErrorError(
        `Failed to resize and upload avatars.`,
        e
      );
    }

    await this.coreDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildUpdateUserAvatarStatement(
          `${request.userSession.userId}/${UploadAvatarHandler.LARGE_FILE_NAME}`,
          `${request.userSession.userId}/${UploadAvatarHandler.SMALL_FILE_NAME}`,
          request.userSession.userId
        )
      );
      await transaction.commit();
    });
    return {};
  }

  private async resizeAndUpload(
    body: Buffer,
    width: number,
    height: number,
    outputFile: string
  ): Promise<void> {
    await pipeline(
      sharp(body).resize(width, height, { fit: "contain" }).png({
        progressive: true,
        compressionLevel: 9,
        palette: true,
        effort: 10,
      }),
      this.cloudStorage
        .bucket(this.bucketName)
        .file(outputFile)
        .createWriteStream()
    );
  }
}
