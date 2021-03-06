import {
  SIGN_UP,
  SignUpRequest,
  SignUpResponse,
} from "../../interface/service";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { CORE_DATABASE } from "../common/spanner_database";
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
    private bucketName: string,
    private passwordHasher: PasswordHasher,
    private sessionBuilder: SessionBuilder,
    private coreDatabase: Database,
    private randomFn: () => number
  ) {}

  public static create(bucketName: string): SignUpHandler {
    return new SignUpHandler(
      bucketName,
      PasswordHasher.create(),
      SessionBuilder.create(),
      CORE_DATABASE,
      () => Math.random()
    );
  }

  public async handle(request: SignUpRequest): Promise<SignUpResponse> {
    let userId = uuidv4();
    let pictureIndex = Math.floor(this.randomFn() * 2);
    await this.coreDatabase.runTransactionAsync(async (transaction) => {
      await transaction.runUpdate(
        buildInsertNewUserStatement(
          userId,
          request.username,
          request.naturalName,
          this.passwordHasher.hash(request.password),
          `https://storage.googleapis.com/${this.bucketName}/default${pictureIndex}.jpg`
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
