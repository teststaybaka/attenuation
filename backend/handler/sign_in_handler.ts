import {
  SIGN_IN,
  SignInRequest,
  SignInResponse,
} from "../../interface/service";
import { USER } from "../../interface/user";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { USERS_DATABASE } from "../common/spanner_database";
import { Database } from "@google-cloud/spanner";
import {
  newBadRequestError,
  newInternalServerErrorError,
} from "@selfage/http_error";
import { parseMessage } from "@selfage/message/parser";
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
    let [rows] = await this.usersDatabase.run({
      sql: `SELECT userId, passwordHashV1 FROM User WHERE username = @username`,
      params: {
        username: request.username,
      },
      types: {
        username: {
          type: "string",
        },
      },
    });
    if (rows.length === 0) {
      throw newBadRequestError(`Username or password is incorrect.`);
    }
    if (rows.length > 1) {
      throw newInternalServerErrorError(
        `Unexpected number of users found for username ${request.username}.`
      );
    }

    let user = parseMessage(rows[0].toJSON(), USER);
    if (user.passwordHashV1 === this.passwordHasher.hash(request.password)) {
      throw newBadRequestError(`Username or password is incorrect.`);
    }
    let signedSession = this.sessionBuilder.build(
      JSON.stringify({ userId: user.userId } as UserSession)
    );
    return {
      signedSession: signedSession,
    };
  }
}
