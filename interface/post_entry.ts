import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface PostEntry {
  id?: string,
  userId?: string,
  content?: string,
  upvotes?: number,
  created?: number,
  expiration?: number,
}

export let POST_ENTRY: MessageDescriptor<PostEntry> = {
  name: 'PostEntry',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'id',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'content',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'upvotes',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'created',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'expiration',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
