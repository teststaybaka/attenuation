import { SignUpRequestBody, SignUpResponse, SIGN_UP, SignInRequestBody, SignInResponse, SIGN_IN, GetUserInfoRequestBody, GetUserInfoResponse, GET_USER_INFO, CreatePostRequestBody, CreatePostResponse, CREATE_POST, ReadPostsRequestBody, ReadPostsResponse, READ_POSTS, ViewPostRequestBody, ViewPostResponse, VIEW_POST, ReactToPostRequestBody, ReactToPostResponse, REACT_TO_POST, UploadAvatarResponse, UPLOAD_AVATAR } from '../../interface/service';
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

export interface CreatePostHandlerRequest {
  requestId: string;
  body: CreatePostRequestBody;
  userSession: UserSession
}

export abstract class CreatePostHandlerInterface
  implements ServiceHandler<CreatePostHandlerRequest, CreatePostResponse>
{
  public descriptor = CREATE_POST;
  public abstract handle(
    args: CreatePostHandlerRequest
  ): Promise<CreatePostResponse>;
}

export interface ReadPostsHandlerRequest {
  requestId: string;
  body: ReadPostsRequestBody;
  userSession: UserSession
}

export abstract class ReadPostsHandlerInterface
  implements ServiceHandler<ReadPostsHandlerRequest, ReadPostsResponse>
{
  public descriptor = READ_POSTS;
  public abstract handle(
    args: ReadPostsHandlerRequest
  ): Promise<ReadPostsResponse>;
}

export interface ViewPostHandlerRequest {
  requestId: string;
  body: ViewPostRequestBody;
  userSession: UserSession
}

export abstract class ViewPostHandlerInterface
  implements ServiceHandler<ViewPostHandlerRequest, ViewPostResponse>
{
  public descriptor = VIEW_POST;
  public abstract handle(
    args: ViewPostHandlerRequest
  ): Promise<ViewPostResponse>;
}

export interface ReactToPostHandlerRequest {
  requestId: string;
  body: ReactToPostRequestBody;
  userSession: UserSession
}

export abstract class ReactToPostHandlerInterface
  implements ServiceHandler<ReactToPostHandlerRequest, ReactToPostResponse>
{
  public descriptor = REACT_TO_POST;
  public abstract handle(
    args: ReactToPostHandlerRequest
  ): Promise<ReactToPostResponse>;
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
