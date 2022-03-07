import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { UnauthedServiceDescriptor, AuthedServiceDescriptor } from '@selfage/service_descriptor';
import { PostEntry, POST_ENTRY } from './post_entry';

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

export interface CreatePostRequest {
  signedSession?: string,
  postEntry?: PostEntry,
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
      name: 'postEntry',
      messageDescriptor: POST_ENTRY,
    },
  ]
};

export interface CreatePostResponse {
  postEntry?: PostEntry,
}

export let CREATE_POST_RESPONSE: MessageDescriptor<CreatePostResponse> = {
  name: 'CreatePostResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntry',
      messageDescriptor: POST_ENTRY,
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
  postEntries?: Array<PostEntry>,
}

export let READ_POSTS_RESPONSE: MessageDescriptor<ReadPostsResponse> = {
  name: 'ReadPostsResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntries',
      enumDescriptor: POST_ENTRY,
      arrayFactoryFn: () => {
        return new Array<any>();
      },
    },
  ]
};
