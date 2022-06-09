import {
  GET_USER_INFO,
  GetUserInfoRequest,
  GetUserInfoResponse,
} from "../../interface/service";
import { USER_SESSION, UserSession } from "../../interface/user_session";
import { CORE_DATABASE } from "../common/spanner_database";
import { buildGetUserInfoStatement, parseGetUserInfoRow } from "./users_sql";
import { Database } from "@google-cloud/spanner";
import { newInternalServerErrorError } from "@selfage/http_error";
import { AuthedServiceHandler } from "@selfage/service_handler";

export class GetUserInfoHandler
  implements
    AuthedServiceHandler<GetUserInfoRequest, GetUserInfoResponse, UserSession>
{
  public sessionDescriptor = USER_SESSION;
  public serviceDescriptor = GET_USER_INFO;

  public constructor(private coreDatabase: Database) {}

  public static create(): GetUserInfoHandler {
    return new GetUserInfoHandler(CORE_DATABASE);
  }

  public async handle(
    request: GetUserInfoRequest,
    session: UserSession
  ): Promise<GetUserInfoResponse> {
    let [rows] = await this.coreDatabase.run(
      buildGetUserInfoStatement(session.userId)
    );
    if (rows.length !== 1) {
      throw newInternalServerErrorError(
        `The number of users find by the id ${session.userId}: ${rows.length}.`
      );
    }

    let getUserInfoRow = parseGetUserInfoRow(rows[0]);
    return {
      username: getUserInfoRow.username,
      naturalName: getUserInfoRow.naturalName,
      pictureUrl: getUserInfoRow.pictureUrl,
    };
  }
}
