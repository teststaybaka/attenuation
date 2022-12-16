import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface QuickLayoutTale {
  text?: string,
  images?: Array<string>,
}

export let QUICK_LAYOUT_TALE: MessageDescriptor<QuickLayoutTale> = {
  name: 'QuickLayoutTale',
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

export interface TaleCard {
  taleId?: string,
  repliedTaleId?: string,
  userId?: string,
  username?: string,
  userNatureName?: string,
  avatarSmallPath?: string,
  createdTimestamp?: number,
  quickLayoutTale?: QuickLayoutTale,
}

export let TALE_CARD: MessageDescriptor<TaleCard> = {
  name: 'TaleCard',
  fields: [
    {
      name: 'taleId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'repliedTaleId',
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
      name: 'quickLayoutTale',
      messageType: QUICK_LAYOUT_TALE,
    },
  ]
};
