import { SignUpRequestBody, SignUpResponse, SIGN_UP, SignInRequestBody, SignInResponse, SIGN_IN, GetUserInfoRequestBody, GetUserInfoResponse, GET_USER_INFO, UploadAvatarResponse, UPLOAD_AVATAR } from '../../interface/user_service';
import { ServiceHandler } from '@selfage/service_descriptor';
import { UserSession } from '../../interface/user_session';
import { Readable } from 'stream';

export interface SignUpHandlerRequest {
  requestId: string;
  body: SignUpRequestBody;
}

export abstract class SignUpHandlerInterface
  implements ServiceHandler<SignUpHandlerRequest, SignUpResponse>
{
  public descriptor = SIGN_UP;
  public abstract handle(
    args: SignUpHandlerRequest
  ): Promise<SignUpResponse>;
}

export interface SignInHandlerRequest {
  requestId: string;
  body: SignInRequestBody;
}

export abstract class SignInHandlerInterface
  implements ServiceHandler<SignInHandlerRequest, SignInResponse>
{
  public descriptor = SIGN_IN;
  public abstract handle(
    args: SignInHandlerRequest
  ): Promise<SignInResponse>;
}

export interface GetUserInfoHandlerRequest {
  requestId: string;
  body: GetUserInfoRequestBody;
  userSession: UserSession
}

export abstract class GetUserInfoHandlerInterface
  implements ServiceHandler<GetUserInfoHandlerRequest, GetUserInfoResponse>
{
  public descriptor = GET_USER_INFO;
  public abstract handle(
    args: GetUserInfoHandlerRequest
  ): Promise<GetUserInfoResponse>;
}

export interface UploadAvatarHandlerRequest {
  requestId: string;
  body: Readable;
  userSession: UserSession
}

export abstract class UploadAvatarHandlerInterface
  implements ServiceHandler<UploadAvatarHandlerRequest, UploadAvatarResponse>
{
  public descriptor = UPLOAD_AVATAR;
  public abstract handle(
    args: UploadAvatarHandlerRequest
  ): Promise<UploadAvatarResponse>;
}
