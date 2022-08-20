import { SignInResponse } from "../../interface/service";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { CORE_DATABASE } from "../common/spanner_database";
import { SignInHandlerRequest, SignUpHandlerInterface } from "./interfaces";
import {
  buildLookupUserByUsernameStatement,
  parseLookupUserByUsernameRow,
} from "./users_sql";
import { Database } from "@google-cloud/spanner";
import {
  newBadRequestError,
  newInternalServerErrorError,
} from "@selfage/http_error";
import { SessionBuilder } from "@selfage/service_handler/session_signer";

export class SignInHandler extends SignUpHandlerInterface {
  public constructor(
    private passwordHasher: PasswordHasher,
    private sessionBuilder: SessionBuilder,
    private coreDatabase: Database
  ) {
    super();
  }

  public static create(): SignInHandler {
    return new SignInHandler(
      PasswordHasher.create(),
      SessionBuilder.create(),
      CORE_DATABASE
    );
  }

  public async handle(request: SignInHandlerRequest): Promise<SignInResponse> {
    let [rows] = await this.coreDatabase.run(
      buildLookupUserByUsernameStatement(request.body.username)
    );
    if (rows.length === 0) {
      throw newBadRequestError(`Username or password is incorrect.`);
    }
    if (rows.length > 1) {
      throw newInternalServerErrorError(
        `Unexpected number of users found for username ${request.body.username}.`
      );
    }

    let lookupUserRow = parseLookupUserByUsernameRow(rows[0]);
    if (
      lookupUserRow.passwordHashV1 ===
      this.passwordHasher.hash(request.body.password)
    ) {
      throw newBadRequestError(`Username or password is incorrect.`);
    }
    let signedSession = this.sessionBuilder.build(
      JSON.stringify({ userId: lookupUserRow.userId } as UserSession)
    );
    return {
      signedSession: signedSession,
    };
  }
}
