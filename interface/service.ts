import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { ServiceDescriptor, PrimitveTypeForBody } from '@selfage/service_descriptor';
import { USER_SESSION } from './user_session';
import { PostEntryCard, POST_ENTRY_CARD } from './post_entry_card';
import { PostEntryReaction, POST_ENTRY_REACTION } from './post_entry_reaction';

export interface SignUpRequestBody {
  username?: string,
  naturalName?: string,
  password?: string,
}

export let SIGN_UP_REQUEST_BODY: MessageDescriptor<SignUpRequestBody> = {
  name: 'SignUpRequestBody',
  fields: [
    {
      name: 'username',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'naturalName',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'password',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface SignUpResponse {
  signedSession?: string,
}

export let SIGN_UP_RESPONSE: MessageDescriptor<SignUpResponse> = {
  name: 'SignUpResponse',
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let SIGN_UP: ServiceDescriptor = {
  name: "SignUp",
  path: "/SignUp",
  body: {
    messageType: SIGN_UP_REQUEST_BODY,
  },
  response: {
    messageType: SIGN_UP_RESPONSE,
  },
}

export interface SignInRequestBody {
  username?: string,
  password?: string,
}

export let SIGN_IN_REQUEST_BODY: MessageDescriptor<SignInRequestBody> = {
  name: 'SignInRequestBody',
  fields: [
    {
      name: 'username',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'password',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface SignInResponse {
  signedSession?: string,
}

export let SIGN_IN_RESPONSE: MessageDescriptor<SignInResponse> = {
  name: 'SignInResponse',
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let SIGN_IN: ServiceDescriptor = {
  name: "SignIn",
  path: "/SignIn",
  body: {
    messageType: SIGN_IN_REQUEST_BODY,
  },
  response: {
    messageType: SIGN_IN_RESPONSE,
  },
}

export interface GetUserInfoRequestBody {
}

export let GET_USER_INFO_REQUEST_BODY: MessageDescriptor<GetUserInfoRequestBody> = {
  name: 'GetUserInfoRequestBody',
  fields: [
  ]
};

export interface GetUserInfoResponse {
  username?: string,
  naturalName?: string,
  email?: string,
  avatarLargePath?: string,
}

export let GET_USER_INFO_RESPONSE: MessageDescriptor<GetUserInfoResponse> = {
  name: 'GetUserInfoResponse',
  fields: [
    {
      name: 'username',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'naturalName',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'email',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'avatarLargePath',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let GET_USER_INFO: ServiceDescriptor = {
  name: "GetUserInfo",
  path: "/GetUserInfo",
  body: {
    messageType: GET_USER_INFO_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: GET_USER_INFO_RESPONSE,
  },
}

export interface CreatePostRequestBody {
  content?: string,
}

export let CREATE_POST_REQUEST_BODY: MessageDescriptor<CreatePostRequestBody> = {
  name: 'CreatePostRequestBody',
  fields: [
    {
      name: 'content',
      primitiveType: PrimitiveType.STRING,
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

export interface ReadPostsRequestBody {
}

export let READ_POSTS_REQUEST_BODY: MessageDescriptor<ReadPostsRequestBody> = {
  name: 'ReadPostsRequestBody',
  fields: [
  ]
};

export interface ReadPostsResponse {
  postEntryCards?: Array<PostEntryCard>,
}

export let READ_POSTS_RESPONSE: MessageDescriptor<ReadPostsResponse> = {
  name: 'ReadPostsResponse',
  fields: [
    {
      name: 'postEntryCards',
      messageType: POST_ENTRY_CARD,
      isArray: true,
    },
  ]
};

export let READ_POSTS: ServiceDescriptor = {
  name: "ReadPosts",
  path: "/ReadPosts",
  body: {
    messageType: READ_POSTS_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: READ_POSTS_RESPONSE,
  },
}

export interface ViewPostRequestBody {
  postEntryId?: string,
}

export let VIEW_POST_REQUEST_BODY: MessageDescriptor<ViewPostRequestBody> = {
  name: 'ViewPostRequestBody',
  fields: [
    {
      name: 'postEntryId',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface ViewPostResponse {
}

export let VIEW_POST_RESPONSE: MessageDescriptor<ViewPostResponse> = {
  name: 'ViewPostResponse',
  fields: [
  ]
};

export let VIEW_POST: ServiceDescriptor = {
  name: "ViewPost",
  path: "/ViewPost",
  body: {
    messageType: VIEW_POST_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: VIEW_POST_RESPONSE,
  },
}

export interface ReactToPostRequestBody {
  postEntryId?: string,
  reaction?: PostEntryReaction,
}

export let REACT_TO_POST_REQUEST_BODY: MessageDescriptor<ReactToPostRequestBody> = {
  name: 'ReactToPostRequestBody',
  fields: [
    {
      name: 'postEntryId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'reaction',
      enumType: POST_ENTRY_REACTION,
    },
  ]
};

export interface ReactToPostResponse {
}

export let REACT_TO_POST_RESPONSE: MessageDescriptor<ReactToPostResponse> = {
  name: 'ReactToPostResponse',
  fields: [
  ]
};

export let REACT_TO_POST: ServiceDescriptor = {
  name: "ReactToPost",
  path: "/ReactToPost",
  body: {
    messageType: REACT_TO_POST_REQUEST_BODY,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: REACT_TO_POST_RESPONSE,
  },
}

export interface UploadAvatarResponse {
}

export let UPLOAD_AVATAR_RESPONSE: MessageDescriptor<UploadAvatarResponse> = {
  name: 'UploadAvatarResponse',
  fields: [
  ]
};

export let UPLOAD_AVATAR: ServiceDescriptor = {
  name: "UploadAvatar",
  path: "/UploadAvatar",
  body: {
    primitiveType: PrimitveTypeForBody.BYTES,
  },
  signedUserSession: {
    key: "u",
    type: USER_SESSION
  },
  response: {
    messageType: UPLOAD_AVATAR_RESPONSE,
  },
}
