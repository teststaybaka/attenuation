import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface BasicUserInfo {
  username?: string,
  naturalName?: string,
  email?: string,
  profileUrl?: string,
}

export let BASIC_USER_INFO: MessageDescriptor<BasicUserInfo> = {
  name: 'BasicUserInfo',
  factoryFn: () => {
    return new Object();
  },
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
      name: 'profileUrl',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};
