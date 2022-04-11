import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface User {
  userId?: string,
  username?: string,
  passwordHashV1?: string,
  googleUserId?: string,
  createdTimestamp?: number,
}

export let USER: MessageDescriptor<User> = {
  name: 'User',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'username',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'passwordHashV1',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'googleUserId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'createdTimestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
