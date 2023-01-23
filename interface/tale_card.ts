import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { TaleReaction, TALE_REACTION } from './tale_reaction';

export interface TaleCardMedata {
  taleId?: string,
  userId?: string,
  username?: string,
  userNatureName?: string,
  avatarSmallPath?: string,
  createdTimestamp?: number,
  reaction?: TaleReaction,
}

export let TALE_CARD_MEDATA: MessageDescriptor<TaleCardMedata> = {
  name: 'TaleCardMedata',
  fields: [
    {
      name: 'taleId',
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
      name: 'reaction',
      enumType: TALE_REACTION,
    },
  ]
};

export interface QuickTaleCard {
  metadata?: TaleCardMedata,
  text?: string,
  images?: Array<string>,
}

export let QUICK_TALE_CARD: MessageDescriptor<QuickTaleCard> = {
  name: 'QuickTaleCard',
  fields: [
    {
      name: 'metadata',
      messageType: TALE_CARD_MEDATA,
    },
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
