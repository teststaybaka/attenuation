import { WebServiceRequest } from '@selfage/service_descriptor';
import { UploadImageForTaleResponse, UPLOAD_IMAGE_FOR_TALE, CreateTaleRequestBody, CreateTaleResponse, CREATE_TALE, GetQuickTaleRequestBody, GetQuickTaleResponse, GET_QUICK_TALE, GetRecommendedQuickTalesRequestBody, GetRecommendedQuickTalesResponse, GET_RECOMMENDED_QUICK_TALES, ViewTaleRequestBody, ViewTaleResponse, VIEW_TALE, ReactToTaleRequestBody, ReactToTaleResponse, REACT_TO_TALE } from '../../../interface/tale_service';

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

export interface GetQuickTaleClientRequest {
  body: GetQuickTaleRequestBody;
}

export function newGetQuickTaleServiceRequest(
  request: GetQuickTaleClientRequest
): WebServiceRequest<GetQuickTaleClientRequest, GetQuickTaleResponse> {
  return {
    descriptor: GET_QUICK_TALE,
    request,
  };
}

export interface GetRecommendedQuickTalesClientRequest {
  body: GetRecommendedQuickTalesRequestBody;
}

export function newGetRecommendedQuickTalesServiceRequest(
  request: GetRecommendedQuickTalesClientRequest
): WebServiceRequest<GetRecommendedQuickTalesClientRequest, GetRecommendedQuickTalesResponse> {
  return {
    descriptor: GET_RECOMMENDED_QUICK_TALES,
    request,
  };
}

export interface ViewTaleClientRequest {
  body: ViewTaleRequestBody;
}

export function newViewTaleServiceRequest(
  request: ViewTaleClientRequest
): WebServiceRequest<ViewTaleClientRequest, ViewTaleResponse> {
  return {
    descriptor: VIEW_TALE,
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
