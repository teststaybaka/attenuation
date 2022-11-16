import { WebServiceRequest } from '@selfage/service_descriptor';
import { UploadImageForPostResponse, UPLOAD_IMAGE_FOR_POST, CreatePostRequestBody, CreatePostResponse, CREATE_POST } from '../../../interface/post_life_cycle_service';

export interface UploadImageForPostClientRequest {
  body: Blob;
}

export function newUploadImageForPostServiceRequest(
  request: UploadImageForPostClientRequest
): WebServiceRequest<UploadImageForPostClientRequest, UploadImageForPostResponse> {
  return {
    descriptor: UPLOAD_IMAGE_FOR_POST,
    request,
  };
}

export interface CreatePostClientRequest {
  body: CreatePostRequestBody;
}

export function newCreatePostServiceRequest(
  request: CreatePostClientRequest
): WebServiceRequest<CreatePostClientRequest, CreatePostResponse> {
  return {
    descriptor: CREATE_POST,
    request,
  };
}
