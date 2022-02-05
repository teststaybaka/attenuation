import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { UnauthedServiceDescriptor } from '@selfage/service_descriptor';

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
