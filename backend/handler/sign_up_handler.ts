import {
  SIGN_UP,
  SignUpRequest,
  SignUpResponse,
} from "../../interface/service";
import { User } from "../../interface/user";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { USER_TABLE } from "../common/spanner_database";
import { Table } from "@google-cloud/spanner";
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
    private userTable: Table
  ) {}

  public static create(): SignUpHandler {
    return new SignUpHandler(
      PasswordHasher.create(),
      SessionBuilder.create(),
      USER_TABLE
    );
  }

  public async handle(request: SignUpRequest): Promise<SignUpResponse> {
    let user: User = {
      userId: uuidv4(),
      username: request.username,
      passwordHashV1: this.passwordHasher.hash(request.password),
    };
    await this.userTable.insert([
      {
        ...user,
        createdTimestamp: "spanner.commit_timestamp()",
      },
    ]);

    let signedSession = this.sessionBuilder.build(
      JSON.stringify({ userId: user.userId } as UserSession)
    );
    return {
      signedSession: signedSession,
    };
  }
}
