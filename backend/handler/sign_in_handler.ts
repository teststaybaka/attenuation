import {
  SIGN_IN,
  SignInRequest,
  SignInResponse,
} from "../../interface/service";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { CORE_DATABASE } from "../common/spanner_database";
import { buildLookupUserStatement, parseLookupUserRow } from "./users_sql";
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
    private coreDatabase: Database
  ) {}

  public static create(): SignInHandler {
    return new SignInHandler(
      PasswordHasher.create(),
      SessionBuilder.create(),
      CORE_DATABASE
    );
  }

  public async handle(request: SignInRequest): Promise<SignInResponse> {
    let [rows] = await this.coreDatabase.run(
      buildLookupUserStatement(request.username)
    );
    if (rows.length === 0) {
      throw newBadRequestError(`Username or password is incorrect.`);
    }
    if (rows.length > 1) {
      throw newInternalServerErrorError(
        `Unexpected number of users found for username ${request.username}.`
      );
    }

    let lookupUserRow = parseLookupUserRow(rows[0]);
    if (
      lookupUserRow.passwordHashV1 ===
      this.passwordHasher.hash(request.password)
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
