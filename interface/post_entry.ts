import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface PostEntry {
  id?: string,
  userId?: string,
  content?: string,
  created?: number,
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
      name: 'created',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
