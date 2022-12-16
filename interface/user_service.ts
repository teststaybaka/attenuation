import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { ServiceDescriptor, PrimitveTypeForBody } from '@selfage/service_descriptor';
import { USER_SESSION } from './user_session';

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
