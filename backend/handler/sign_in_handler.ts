import {
  SIGN_IN,
  SignInRequest,
  SignInResponse,
} from "../../interface/service";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { USERS_DATABASE } from "../common/spanner_database";
import { buildGetUserStatement, parseGetUserRow } from "./users_sql";
import { Database } from "@google-cloud/spanner";
import {
  newBadRequestError,
  newInternalServerErrorError,
} from "@selfage/http_error";
import { UnauthedServiceHandler } from "@selfage/service_handler";
import { SessionBuilder } from "@selfage/service_handler/session_signer";

export class SignInHandler
  implements UnauthedServiceHandler<SignInRequest, SignInResponse>
{
  public serviceDescriptor = SIGN_IN;

  public constructor(
    private passwordHasher: PasswordHasher,
    private sessionBuilder: SessionBuilder,
    private usersDatabase: Database
  ) {}

  public static create(): SignInHandler {
    return new SignInHandler(
      PasswordHasher.create(),
      SessionBuilder.create(),
      USERS_DATABASE
    );
  }

  public async handle(request: SignInRequest): Promise<SignInResponse> {
    let [rows] = await this.usersDatabase.run(
      buildGetUserStatement(request.username)
    );
    if (rows.length === 0) {
      throw newBadRequestError(`Username or password is incorrect.`);
    }
    if (rows.length > 1) {
      throw newInternalServerErrorError(
        `Unexpected number of users found for username ${request.username}.`
      );
    }

    let getUserRow = parseGetUserRow(rows[0]);
    if (
      getUserRow.passwordHashV1 === this.passwordHasher.hash(request.password)
    ) {
      throw newBadRequestError(`Username or password is incorrect.`);
    }
    let signedSession = this.sessionBuilder.build(
      JSON.stringify({ userId: getUserRow.userId } as UserSession)
    );
    return {
      signedSession: signedSession,
    };
  }
}
