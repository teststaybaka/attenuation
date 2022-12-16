import { WebServiceRequest } from '@selfage/service_descriptor';
import { UploadImageForTaleResponse, UPLOAD_IMAGE_FOR_TALE, CreateTaleRequestBody, CreateTaleResponse, CREATE_TALE, ReactToTaleRequestBody, ReactToTaleResponse, REACT_TO_TALE } from '../../../interface/tale_service';

export interface UploadImageForTaleClientRequest {
  body: Blob;
}

export function newUploadImageForTaleServiceRequest(
  request: UploadImageForTaleClientRequest
): WebServiceRequest<UploadImageForTaleClientRequest, UploadImageForTaleResponse> {
  return {
    descriptor: UPLOAD_IMAGE_FOR_TALE,
    request,
  };
}

export interface CreateTaleClientRequest {
  body: CreateTaleRequestBody;
}

export function newCreateTaleServiceRequest(
  request: CreateTaleClientRequest
): WebServiceRequest<CreateTaleClientRequest, CreateTaleResponse> {
  return {
    descriptor: CREATE_TALE,
    request,
  };
}

export interface ReactToTaleClientRequest {
  body: ReactToTaleRequestBody;
}

export function newReactToTaleServiceRequest(
  request: ReactToTaleClientRequest
): WebServiceRequest<ReactToTaleClientRequest, ReactToTaleResponse> {
  return {
    descriptor: REACT_TO_TALE,
    request,
  };
}
