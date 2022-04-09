import { MessageDescriptor, PrimitiveType, EnumDescriptor } from '@selfage/message/descriptor';

export interface PostEntry {
  postEntryId?: string,
  userId?: string,
  content?: string,
  upvotes?: number,
  createdTimestamp?: number,
  expirationTimestamp?: number,
}

export let POST_ENTRY: MessageDescriptor<PostEntry> = {
  name: 'PostEntry',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntryId',
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
      name: 'createdTimestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'expirationTimestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};

export enum Reaction {
  unknown = 0,
  upvote = 1,
  downvote = 2,
  seen = 3,
}

export let REACTION: EnumDescriptor<Reaction> = {
  name: 'Reaction',
  values: [
    {
      name: 'unknown',
      value: 0,
    },
    {
      name: 'upvote',
      value: 1,
    },
    {
      name: 'downvote',
      value: 2,
    },
    {
      name: 'seen',
      value: 3,
    },
  ]
}

export interface PostEntrySeen {
  postEntryId?: string,
  seenUserId?: string,
  reaction?: Reaction,
  seenTimestamp?: number,
}

export let POST_ENTRY_SEEN: MessageDescriptor<PostEntrySeen> = {
  name: 'PostEntrySeen',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntryId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'seenUserId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'reaction',
      enumDescriptor: REACTION,
    },
    {
      name: 'seenTimestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
