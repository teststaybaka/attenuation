import { EnumDescriptor } from '@selfage/message/descriptor';

export enum PostEntryReaction {
  UNKNOWN = 0,
  UPVOTE = 1,
}

export let POST_ENTRY_REACTION: EnumDescriptor<PostEntryReaction> = {
  name: 'PostEntryReaction',
  values: [
    {
      name: 'UNKNOWN',
      value: 0,
    },
    {
      name: 'UPVOTE',
      value: 1,
    },
  ]
}
