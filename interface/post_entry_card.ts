import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface PostEntryCard {
  postEntryId?: string,
  repliedEntryId?: string,
  userId?: string,
  username?: string,
  userNatureName?: string,
  userProfilePicture?: string,
  content?: string,
  createdTimestamp?: number,
}

export let POST_ENTRY_CARD: MessageDescriptor<PostEntryCard> = {
  name: 'PostEntryCard',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntryId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'repliedEntryId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'username',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'userNatureName',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'userProfilePicture',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'content',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'createdTimestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
