import { SignUpResponse } from "../../interface/service";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { CORE_DATABASE } from "../common/spanner_database";
import { SignUpHandlerInterface, SignUpHandlerRequest } from "./interfaces";
import { buildInsertNewUserStatement } from "./users_sql";
import { Database } from "@google-cloud/spanner";
import { SessionBuilder } from "@selfage/service_handler/session_signer";
import { v4 as uuidv4 } from "uuid";

export class SignUpHandler extends SignUpHandlerInterface {
  public constructor(
    private passwordHasher: PasswordHasher,
    private sessionBuilder: SessionBuilder,
    private coreDatabase: Database,
    private randomFn: () => number
  ) {
    super();
  }

  public static create(): SignUpHandler {
    return new SignUpHandler(
      PasswordHasher.create(),
      SessionBuilder.create(),
      CORE_DATABASE,
      () => Math.random()
    );
  }

  public async handle(request: SignUpHandlerRequest): Promise<SignUpResponse> {
    let userId = uuidv4();
    let pictureIndex = Math.floor(this.randomFn() * 2);
    await this.coreDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertNewUserStatement(
          userId,
          request.body.username,
          request.body.naturalName,
          this.passwordHasher.hash(request.body.password),
          `default${pictureIndex}.jpg`,
          `default${pictureIndex}.jpg`
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
