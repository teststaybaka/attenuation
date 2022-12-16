import { Readable } from 'stream';
import { UserSession } from '../../interface/user_session';
import { ServiceHandler } from '@selfage/service_descriptor';
import { UploadImageForTaleResponse, UPLOAD_IMAGE_FOR_TALE, CreateTaleRequestBody, CreateTaleResponse, CREATE_TALE, ReactToTaleRequestBody, ReactToTaleResponse, REACT_TO_TALE } from '../../interface/tale_service';

export interface UploadImageForTaleHandlerRequest {
  requestId: string;
  body: Readable;
  userSession: UserSession
}

export abstract class UploadImageForTaleHandlerInterface
  implements ServiceHandler<UploadImageForTaleHandlerRequest, UploadImageForTaleResponse>
{
  public descriptor = UPLOAD_IMAGE_FOR_TALE;
  public abstract handle(
    args: UploadImageForTaleHandlerRequest
  ): Promise<UploadImageForTaleResponse>;
}

export interface CreateTaleHandlerRequest {
  requestId: string;
  body: CreateTaleRequestBody;
  userSession: UserSession
}

export abstract class CreateTaleHandlerInterface
  implements ServiceHandler<CreateTaleHandlerRequest, CreateTaleResponse>
{
  public descriptor = CREATE_TALE;
  public abstract handle(
    args: CreateTaleHandlerRequest
  ): Promise<CreateTaleResponse>;
}

export interface ReactToTaleHandlerRequest {
  requestId: string;
  body: ReactToTaleRequestBody;
  userSession: UserSession
}

export abstract class ReactToTaleHandlerInterface
  implements ServiceHandler<ReactToTaleHandlerRequest, ReactToTaleResponse>
{
  public descriptor = REACT_TO_TALE;
  public abstract handle(
    args: ReactToTaleHandlerRequest
  ): Promise<ReactToTaleResponse>;
}
