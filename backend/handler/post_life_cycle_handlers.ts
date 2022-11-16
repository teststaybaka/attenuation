import { Readable } from 'stream';
import { UserSession } from '../../interface/user_session';
import { ServiceHandler } from '@selfage/service_descriptor';
import { UploadImageForPostResponse, UPLOAD_IMAGE_FOR_POST, CreatePostRequestBody, CreatePostResponse, CREATE_POST } from '../../interface/post_life_cycle_service';

export interface UploadImageForPostHandlerRequest {
  requestId: string;
  body: Readable;
  userSession: UserSession
}

export abstract class UploadImageForPostHandlerInterface
  implements ServiceHandler<UploadImageForPostHandlerRequest, UploadImageForPostResponse>
{
  public descriptor = UPLOAD_IMAGE_FOR_POST;
  public abstract handle(
    args: UploadImageForPostHandlerRequest
  ): Promise<UploadImageForPostResponse>;
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
