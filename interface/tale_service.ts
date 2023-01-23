import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { ServiceDescriptor, PrimitveTypeForBody } from '@selfage/service_descriptor';
import { USER_SESSION } from './user_session';
import { WarningTagType, WARNING_TAG_TYPE } from './warning_tag_type';
import { QuickTaleCard, QUICK_TALE_CARD } from './tale_card';
import { TaleContext, TALE_CONTEXT } from './tale_context';
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

export interface QuickLayoutTaleToCreate {
  text?: string,
  images?: Array<string>,
}

export let QUICK_LAYOUT_TALE_TO_CREATE: MessageDescriptor<QuickLayoutTaleToCreate> = {
  name: 'QuickLayoutTaleToCreate',
  fields: [
    {
      name: 'text',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'images',
      primitiveType: PrimitiveType.STRING,
      isArray: true,
    },
  ]
};

export interface CreateTaleRequestBody {
  quickLayout?: QuickLayoutTaleToCreate,
  tags?: Array<string>,
  warningTags?: Array<WarningTagType>,
}

export let CREATE_TALE_REQUEST_BODY: MessageDescriptor<CreateTaleRequestBody> = {
  name: 'CreateTaleRequestBody',
  fields: [
    {
      name: 'quickLayout',
      messageType: QUICK_LAYOUT_TALE_TO_CREATE,
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
}

export let CREATE_TALE_RESPONSE: MessageDescriptor<CreateTaleResponse> = {
  name: 'CreateTaleResponse',
  fields: [
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

export interface GetQuickTaleRequestBody {
  taleId?: string,
}

export let GET_QUICK_TALE_REQUEST_BODY: MessageDescriptor<GetQuickTaleRequestBody> = {
  name: 'GetQuickTaleRequestBody',
  fields: [
    {
      name: 'taleId',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface GetQuickTaleResponse {
  card?: QuickTaleCard,
}

export let GET_QUICK_TALE_RESPONSE: MessageDescriptor<GetQuickTaleResponse> = {
  name: 'GetQuickTaleResponse',
  fields: [
    {
      name: 'card',
      messageType: QUICK_TALE_CARD,
    },
  ]
};

export let GET_QUICK_TALE: ServiceDescriptor = {
  name: "GetQuickTale",
  path: "/GetQuickTale",
  body: {
    messageType: GET_QUICK_TALE_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: GET_QUICK_TALE_RESPONSE,
  },
}

export interface GetRecommendedQuickTalesRequestBody {
  context?: TaleContext,
}

export let GET_RECOMMENDED_QUICK_TALES_REQUEST_BODY: MessageDescriptor<GetRecommendedQuickTalesRequestBody> = {
  name: 'GetRecommendedQuickTalesRequestBody',
  fields: [
    {
      name: 'context',
      messageType: TALE_CONTEXT,
    },
  ]
};

export interface GetRecommendedQuickTalesResponse {
  cards?: Array<QuickTaleCard>,
}

export let GET_RECOMMENDED_QUICK_TALES_RESPONSE: MessageDescriptor<GetRecommendedQuickTalesResponse> = {
  name: 'GetRecommendedQuickTalesResponse',
  fields: [
    {
      name: 'cards',
      messageType: QUICK_TALE_CARD,
      isArray: true,
    },
  ]
};

export let GET_RECOMMENDED_QUICK_TALES: ServiceDescriptor = {
  name: "GetRecommendedQuickTales",
  path: "/GetRecommendedQuickTales",
  body: {
    messageType: GET_RECOMMENDED_QUICK_TALES_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: GET_RECOMMENDED_QUICK_TALES_RESPONSE,
  },
}

export interface ViewTaleRequestBody {
  taleId?: string,
}

export let VIEW_TALE_REQUEST_BODY: MessageDescriptor<ViewTaleRequestBody> = {
  name: 'ViewTaleRequestBody',
  fields: [
    {
      name: 'taleId',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface ViewTaleResponse {
}

export let VIEW_TALE_RESPONSE: MessageDescriptor<ViewTaleResponse> = {
  name: 'ViewTaleResponse',
  fields: [
  ]
};

export let VIEW_TALE: ServiceDescriptor = {
  name: "ViewTale",
  path: "/ViewTale",
  body: {
    messageType: VIEW_TALE_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: VIEW_TALE_RESPONSE,
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
