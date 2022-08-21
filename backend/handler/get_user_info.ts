import { GetUserInfoResponse } from "../../interface/service";
import { CORE_DATABASE } from "../common/spanner_database";
import {
  GetUserInfoHandlerInterface,
  GetUserInfoHandlerRequest,
} from "./interfaces";
import { buildGetUserInfoStatement, parseGetUserInfoRow } from "./users_sql";
import { Database } from "@google-cloud/spanner";
import { newInternalServerErrorError } from "@selfage/http_error";

export class GetUserInfoHandler extends GetUserInfoHandlerInterface {
  public constructor(private coreDatabase: Database) {
    super();
  }

  public static create(): GetUserInfoHandler {
    return new GetUserInfoHandler(CORE_DATABASE);
  }

  public async handle(
    request: GetUserInfoHandlerRequest
  ): Promise<GetUserInfoResponse> {
    let [rows] = await this.coreDatabase.run(
      buildGetUserInfoStatement(request.userSession.userId)
    );
    if (rows.length !== 1) {
      throw newInternalServerErrorError(
        `The number of users find by the id ${request.userSession.userId}: ${rows.length}.`
      );
    }

    let getUserInfoRow = parseGetUserInfoRow(rows[0]);
    return {
      username: getUserInfoRow.username,
      naturalName: getUserInfoRow.naturalName,
      avatarLargePath: getUserInfoRow.avatarLargePath,
    };
  }
}
