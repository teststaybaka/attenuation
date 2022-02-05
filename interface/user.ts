import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface User {
  id?: string,
  username?: string,
  email?: string,
  hashedPassword?: string,
/* timestamp in seconds */
  created?: number,
}

export let USER: MessageDescriptor<User> = {
  name: 'User',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'id',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'username',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'email',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'hashedPassword',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'created',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
