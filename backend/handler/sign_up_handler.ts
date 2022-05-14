import {
  SIGN_UP,
  SignUpRequest,
  SignUpResponse,
} from "../../interface/service";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { USERS_DATABASE } from "../common/spanner_database";
import { buildInsertNewUserStatement } from "./users_sql";
import { Database } from "@google-cloud/spanner";
import { UnauthedServiceHandler } from "@selfage/service_handler";
import { SessionBuilder } from "@selfage/service_handler/session_signer";
import { v4 as uuidv4 } from "uuid";

export class SignUpHandler
  implements UnauthedServiceHandler<SignUpRequest, SignUpResponse>
{
  public serviceDescriptor = SIGN_UP;

  public constructor(
    private passwordHasher: PasswordHasher,
    private sessionBuilder: SessionBuilder,
    private usersDatabase: Database
  ) {}

  public static create(): SignUpHandler {
    return new SignUpHandler(
      PasswordHasher.create(),
      SessionBuilder.create(),
      USERS_DATABASE
    );
  }

  public async handle(request: SignUpRequest): Promise<SignUpResponse> {
    let userId = uuidv4();
    await this.usersDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertNewUserStatement(
          userId,
          request.username,
          this.passwordHasher.hash(request.password)
        )
      );
      await transaction.commit();
    });

    let signedSession = this.sessionBuilder.build(
      JSON.stringify({ userId } as UserSession)
    );
    return {
      signedSession: signedSession,
    };
  }
}
