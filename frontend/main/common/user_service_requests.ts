import { SignUpRequestBody, SignUpResponse, SIGN_UP, SignInRequestBody, SignInResponse, SIGN_IN, GetUserInfoRequestBody, GetUserInfoResponse, GET_USER_INFO, UploadAvatarResponse, UPLOAD_AVATAR } from '../../../interface/user_service';
import { WebServiceRequest } from '@selfage/service_descriptor';

export interface SignUpClientRequest {
  body: SignUpRequestBody;
}

export function newSignUpServiceRequest(
  request: SignUpClientRequest
): WebServiceRequest<SignUpClientRequest, SignUpResponse> {
  return {
    descriptor: SIGN_UP,
    request,
  };
}

export interface SignInClientRequest {
  body: SignInRequestBody;
}

export function newSignInServiceRequest(
  request: SignInClientRequest
): WebServiceRequest<SignInClientRequest, SignInResponse> {
  return {
    descriptor: SIGN_IN,
    request,
  };
}

export interface GetUserInfoClientRequest {
  body: GetUserInfoRequestBody;
}

export function newGetUserInfoServiceRequest(
  request: GetUserInfoClientRequest
): WebServiceRequest<GetUserInfoClientRequest, GetUserInfoResponse> {
  return {
    descriptor: GET_USER_INFO,
    request,
  };
}

export interface UploadAvatarClientRequest {
  body: Blob;
}

export function newUploadAvatarServiceRequest(
  request: UploadAvatarClientRequest
): WebServiceRequest<UploadAvatarClientRequest, UploadAvatarResponse> {
  return {
    descriptor: UPLOAD_AVATAR,
    request,
  };
}
