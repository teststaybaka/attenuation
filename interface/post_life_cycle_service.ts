import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { ServiceDescriptor, PrimitveTypeForBody } from '@selfage/service_descriptor';
import { USER_SESSION } from './user_session';
import { QuickLayoutPost, QUICK_LAYOUT_POST, PostEntryCard, POST_ENTRY_CARD } from './post_entry_card';
import { WarningTagType, WARNING_TAG_TYPE } from './warning_tag_type';

export interface UploadImageForPostResponse {
  url?: string,
}

export let UPLOAD_IMAGE_FOR_POST_RESPONSE: MessageDescriptor<UploadImageForPostResponse> = {
  name: 'UploadImageForPostResponse',
  fields: [
    {
      name: 'url',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let UPLOAD_IMAGE_FOR_POST: ServiceDescriptor = {
  name: "UploadImageForPost",
  path: "/UploadImageForPost",
  body: {
    primitiveType: PrimitveTypeForBody.BYTES,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: UPLOAD_IMAGE_FOR_POST_RESPONSE,
  },
}

export interface CreatePostRequestBody {
  quickLayoutPost?: QuickLayoutPost,
  tags?: Array<string>,
  warningTags?: Array<WarningTagType>,
}

export let CREATE_POST_REQUEST_BODY: MessageDescriptor<CreatePostRequestBody> = {
  name: 'CreatePostRequestBody',
  fields: [
    {
      name: 'quickLayoutPost',
      messageType: QUICK_LAYOUT_POST,
    },
    {
      name: 'tags',
      primitiveType: PrimitiveType.STRING,
      isArray: true,
    },
    {
      name: 'warningTags',
      enumType: WARNING_TAG_TYPE,
      isArray: true,
    },
  ]
};

export interface CreatePostResponse {
  postEntryCard?: PostEntryCard,
}

export let CREATE_POST_RESPONSE: MessageDescriptor<CreatePostResponse> = {
  name: 'CreatePostResponse',
  fields: [
    {
      name: 'postEntryCard',
      messageType: POST_ENTRY_CARD,
    },
  ]
};

export let CREATE_POST: ServiceDescriptor = {
  name: "CreatePost",
  path: "/CreatePost",
  body: {
    messageType: CREATE_POST_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: CREATE_POST_RESPONSE,
  },
}
