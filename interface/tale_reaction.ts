import { EnumDescriptor } from '@selfage/message/descriptor';

export enum TaleReaction {
  UNKNOWN = 0,
  LIKE = 1,
  DISLIKE = 2,
  LOVE = 3,
  HATE = 4,
  DISMISS = 5,
}

export let TALE_REACTION: EnumDescriptor<TaleReaction> = {
  name: 'TaleReaction',
  values: [
    {
      name: 'UNKNOWN',
      value: 0,
    },
    {
      name: 'LIKE',
      value: 1,
    },
    {
      name: 'DISLIKE',
      value: 2,
    },
    {
      name: 'LOVE',
      value: 3,
    },
    {
      name: 'HATE',
      value: 4,
    },
    {
      name: 'DISMISS',
      value: 5,
    },
  ]
}
