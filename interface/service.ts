import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { UnauthedServiceDescriptor, AuthedServiceDescriptor } from '@selfage/service_descriptor';
import { BasicUserInfo, BASIC_USER_INFO } from './basic_user_info';
import { PostEntryCard, POST_ENTRY_CARD } from './post_entry_card';
import { PostEntryReaction, POST_ENTRY_REACTION } from './post_entry_reaction';

export interface SignUpRequest {
  username?: string,
  password?: string,
}

export let SIGN_UP_REQUEST: MessageDescriptor<SignUpRequest> = {
  name: 'SignUpRequest',
  factoryFn: () => {
    return new Object();
  },
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

export interface SignUpResponse {
  signedSession?: string,
}

export let SIGN_UP_RESPONSE: MessageDescriptor<SignUpResponse> = {
  name: 'SignUpResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let SIGN_UP: UnauthedServiceDescriptor<SignUpRequest, SignUpResponse> = {
  name: "SignUp",
  path: "/SignUp",
  requestDescriptor: SIGN_UP_REQUEST,
  responseDescriptor: SIGN_UP_RESPONSE,
};

export interface SignInRequest {
  username?: string,
  password?: string,
}

export let SIGN_IN_REQUEST: MessageDescriptor<SignInRequest> = {
  name: 'SignInRequest',
  factoryFn: () => {
    return new Object();
  },
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
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let SIGN_IN: UnauthedServiceDescriptor<SignInRequest, SignInResponse> = {
  name: "SignIn",
  path: "/SignIn",
  requestDescriptor: SIGN_IN_REQUEST,
  responseDescriptor: SIGN_IN_RESPONSE,
};

export interface GetBasicUserInfoRequest {
  signedSession?: string,
}

export let GET_BASIC_USER_INFO_REQUEST: MessageDescriptor<GetBasicUserInfoRequest> = {
  name: 'GetBasicUserInfoRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface GetBasicUserInfoResponse {
  basicUserInfo?: BasicUserInfo,
}

export let GET_BASIC_USER_INFO_RESPONSE: MessageDescriptor<GetBasicUserInfoResponse> = {
  name: 'GetBasicUserInfoResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'basicUserInfo',
      messageDescriptor: BASIC_USER_INFO,
    },
  ]
};

export let GET_BASIC_USER_INFO: AuthedServiceDescriptor<GetBasicUserInfoRequest, GetBasicUserInfoResponse> = {
  name: "GetBasicUserInfo",
  path: "/GetBasicUserInfo",
  requestDescriptor: GET_BASIC_USER_INFO_REQUEST,
  responseDescriptor: GET_BASIC_USER_INFO_RESPONSE,
};

export interface CreatePostRequest {
  signedSession?: string,
  content?: string,
}

export let CREATE_POST_REQUEST: MessageDescriptor<CreatePostRequest> = {
  name: 'CreatePostRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
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
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntryCard',
      messageDescriptor: POST_ENTRY_CARD,
    },
  ]
};

export let CREATE_POST: AuthedServiceDescriptor<CreatePostRequest, CreatePostResponse> = {
  name: "CreatePost",
  path: "/CreatePost",
  requestDescriptor: CREATE_POST_REQUEST,
  responseDescriptor: CREATE_POST_RESPONSE,
};

export interface ReadPostsRequest {
  signedSession?: string,
}

export let READ_POSTS_REQUEST: MessageDescriptor<ReadPostsRequest> = {
  name: 'ReadPostsRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface ReadPostsResponse {
  postEntryCards?: Array<PostEntryCard>,
}

export let READ_POSTS_RESPONSE: MessageDescriptor<ReadPostsResponse> = {
  name: 'ReadPostsResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntryCards',
      messageDescriptor: POST_ENTRY_CARD,
      arrayFactoryFn: () => {
        return new Array<any>();
      },
    },
  ]
};

export let READ_POSTS: AuthedServiceDescriptor<ReadPostsRequest, ReadPostsResponse> = {
  name: "ReadPosts",
  path: "/ReadPosts",
  requestDescriptor: READ_POSTS_REQUEST,
  responseDescriptor: READ_POSTS_RESPONSE,
};

export interface ViewPostRequest {
  signedSession?: string,
  postEntryId?: string,
}

export let VIEW_POST_REQUEST: MessageDescriptor<ViewPostRequest> = {
  name: 'ViewPostRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
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
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export let VIEW_POST: AuthedServiceDescriptor<ViewPostRequest, ViewPostResponse> = {
  name: "ViewPost",
  path: "/ViewPost",
  requestDescriptor: VIEW_POST_REQUEST,
  responseDescriptor: VIEW_POST_RESPONSE,
};

export interface ReactToPostRequest {
  signedSession?: string,
  postEntryId?: string,
  reaction?: PostEntryReaction,
}

export let REACT_TO_POST_REQUEST: MessageDescriptor<ReactToPostRequest> = {
  name: 'ReactToPostRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'postEntryId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'reaction',
      enumDescriptor: POST_ENTRY_REACTION,
    },
  ]
};

export interface ReactToPostResponse {
}

export let REACT_TO_POST_RESPONSE: MessageDescriptor<ReactToPostResponse> = {
  name: 'ReactToPostResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export let REACT_TO_POST: AuthedServiceDescriptor<ReactToPostRequest, ReactToPostResponse> = {
  name: "ReactToPost",
  path: "/ReactToPost",
  requestDescriptor: REACT_TO_POST_REQUEST,
  responseDescriptor: REACT_TO_POST_RESPONSE,
};
