import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { ServiceDescriptor, PrimitveTypeForBody } from '@selfage/service_descriptor';
import { USER_SESSION } from './user_session';
import { QuickLayoutTale, QUICK_LAYOUT_TALE, TaleCard, TALE_CARD } from './tale';
import { WarningTagType, WARNING_TAG_TYPE } from './warning_tag_type';
import { TaleReaction, TALE_REACTION } from './tale_reaction';

export interface UploadImageForTaleResponse {
  url?: string,
}

export let UPLOAD_IMAGE_FOR_TALE_RESPONSE: MessageDescriptor<UploadImageForTaleResponse> = {
  name: 'UploadImageForTaleResponse',
  fields: [
    {
      name: 'url',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let UPLOAD_IMAGE_FOR_TALE: ServiceDescriptor = {
  name: "UploadImageForTale",
  path: "/UploadImageForTale",
  body: {
    primitiveType: PrimitveTypeForBody.BYTES,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: UPLOAD_IMAGE_FOR_TALE_RESPONSE,
  },
}

export interface CreateTaleRequestBody {
  quickLayoutTale?: QuickLayoutTale,
  tags?: Array<string>,
  warningTags?: Array<WarningTagType>,
}

export let CREATE_TALE_REQUEST_BODY: MessageDescriptor<CreateTaleRequestBody> = {
  name: 'CreateTaleRequestBody',
  fields: [
    {
      name: 'quickLayoutTale',
      messageType: QUICK_LAYOUT_TALE,
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

export interface CreateTaleResponse {
  taleCard?: TaleCard,
}

export let CREATE_TALE_RESPONSE: MessageDescriptor<CreateTaleResponse> = {
  name: 'CreateTaleResponse',
  fields: [
    {
      name: 'taleCard',
      messageType: TALE_CARD,
    },
  ]
};

export let CREATE_TALE: ServiceDescriptor = {
  name: "CreateTale",
  path: "/CreateTale",
  body: {
    messageType: CREATE_TALE_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: CREATE_TALE_RESPONSE,
  },
}

export interface ReactToTaleRequestBody {
  taleId?: string,
  reaction?: TaleReaction,
}

export let REACT_TO_TALE_REQUEST_BODY: MessageDescriptor<ReactToTaleRequestBody> = {
  name: 'ReactToTaleRequestBody',
  fields: [
    {
      name: 'taleId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'reaction',
      enumType: TALE_REACTION,
    },
  ]
};

export interface ReactToTaleResponse {
}

export let REACT_TO_TALE_RESPONSE: MessageDescriptor<ReactToTaleResponse> = {
  name: 'ReactToTaleResponse',
  fields: [
  ]
};

export let REACT_TO_TALE: ServiceDescriptor = {
  name: "ReactToTale",
  path: "/ReactToTale",
  body: {
    messageType: REACT_TO_TALE_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: REACT_TO_TALE_RESPONSE,
  },
}
