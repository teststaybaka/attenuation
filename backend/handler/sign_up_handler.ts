import {
  SIGN_UP,
  SignUpRequest,
  SignUpResponse,
} from "../../interface/service";
import { User } from "../../interface/user";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { USER_MODEL } from "../data_model/user_model";
import { DatastoreClient } from "@selfage/datastore_client";
import { UnauthedServiceHandler } from "@selfage/service_handler";
import { SessionBuilder } from "@selfage/service_handler/session_signer";

export class SignUpHandler
  implements UnauthedServiceHandler<SignUpRequest, SignUpResponse>
{
  public serviceDescriptor = SIGN_UP;

  public constructor(
    private passwordHasher: PasswordHasher,
    private sessionBuilder: SessionBuilder,
    private datastoreClient: DatastoreClient,
    private getNow: () => number
  ) {}

  public static create(): SignUpHandler {
    return new SignUpHandler(
      PasswordHasher.create(),
      SessionBuilder.create(),
      DatastoreClient.create(),
      () => Date.now()
    );
  }

  public async handle(
    logContext: string,
    request: SignUpRequest
  ): Promise<SignUpResponse> {
    let user: User = {
      username: request.username,
      hashedPassword: this.passwordHasher.hash(request.password),
      created: this.getNow() / 1000,
    };
    await this.datastoreClient.allocateKeys([user], USER_MODEL);
    await this.datastoreClient.save([user], USER_MODEL, "insert");

    let signedSession = this.sessionBuilder.build(
      JSON.stringify({ userId: user.id } as UserSession)
    );
    return {
      signedSession: signedSession,
    };
  }
}
