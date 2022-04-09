import {
  SIGN_IN,
  SignInRequest,
  SignInResponse,
} from "../../interface/service";
import { UserSession } from "../../interface/user_session";
import { PasswordHasher } from "../common/password_hasher";
import { FindUserQueryBuilder } from "../data_model/user_model";
import { DatastoreClient } from "@selfage/datastore_client";
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
    private datastoreClient: DatastoreClient
  ) {}

  public static create(): SignInHandler {
    return new SignInHandler(
      PasswordHasher.create(),
      SessionBuilder.create(),
      DatastoreClient.create()
    );
  }

  public async handle(request: SignInRequest): Promise<SignInResponse> {
    let response = await this.datastoreClient.query(
      new FindUserQueryBuilder().equalToUsername(request.username).build()
    );
    if (response.values.length === 0) {
      throw newBadRequestError(`Username or password incorrect.`);
    } else if (response.values.length > 1) {
      throw newInternalServerErrorError(
        `Unexpected number of users found for username ${request.username}.`
      );
    }
    let user = response.values[0];
    if (user.hashedPassword === this.passwordHasher.hash(request.password)) {
      throw newBadRequestError(`Username or password incorrect.`);
    }
    let signedSession = this.sessionBuilder.build(
      JSON.stringify({ userId: user.id } as UserSession)
    );
    return {
      signedSession: signedSession,
    };
  }
}
