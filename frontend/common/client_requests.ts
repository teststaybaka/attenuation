import { SignUpRequestBody, SignUpResponse, SIGN_UP, SignInRequestBody, SignInResponse, SIGN_IN, GetUserInfoRequestBody, GetUserInfoResponse, GET_USER_INFO, CreatePostRequestBody, CreatePostResponse, CREATE_POST, ReadPostsRequestBody, ReadPostsResponse, READ_POSTS, ViewPostRequestBody, ViewPostResponse, VIEW_POST, ReactToPostRequestBody, ReactToPostResponse, REACT_TO_POST, UploadAvatarResponse, UPLOAD_AVATAR } from '../../interface/service';
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

export interface ReadPostsClientRequest {
  body: ReadPostsRequestBody;
}

export function newReadPostsServiceRequest(
  request: ReadPostsClientRequest
): WebServiceRequest<ReadPostsClientRequest, ReadPostsResponse> {
  return {
    descriptor: READ_POSTS,
    request,
  };
}

export interface ViewPostClientRequest {
  body: ViewPostRequestBody;
}

export function newViewPostServiceRequest(
  request: ViewPostClientRequest
): WebServiceRequest<ViewPostClientRequest, ViewPostResponse> {
  return {
    descriptor: VIEW_POST,
    request,
  };
}

export interface ReactToPostClientRequest {
  body: ReactToPostRequestBody;
}

export function newReactToPostServiceRequest(
  request: ReactToPostClientRequest
): WebServiceRequest<ReactToPostClientRequest, ReactToPostResponse> {
  return {
    descriptor: REACT_TO_POST,
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
