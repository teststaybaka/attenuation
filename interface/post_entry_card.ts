import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface QuickLayoutPost {
  text?: string,
  images?: Array<string>,
}

export let QUICK_LAYOUT_POST: MessageDescriptor<QuickLayoutPost> = {
  name: 'QuickLayoutPost',
  fields: [
    {
      name: 'text',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'images',
      primitiveType: PrimitiveType.STRING,
      isArray: true,
    },
  ]
};

export interface PostEntryCard {
  postEntryId?: string,
  repliedEntryId?: string,
  userId?: string,
  username?: string,
  userNatureName?: string,
  avatarSmallPath?: string,
  createdTimestamp?: number,
  quickLayoutPost?: QuickLayoutPost,
}

export let POST_ENTRY_CARD: MessageDescriptor<PostEntryCard> = {
  name: 'PostEntryCard',
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
      name: 'avatarSmallPath',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'createdTimestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'quickLayoutPost',
      messageType: QUICK_LAYOUT_POST,
    },
  ]
};
