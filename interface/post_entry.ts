import { MessageDescriptor, PrimitiveType, EnumDescriptor } from '@selfage/message/descriptor';

export interface PostEntry {
  postEntryId?: string,
  repliedEntryId?: string,
  userId?: string,
  content?: string,
  views?: number,
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
      name: 'repliedEntryId',
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
      name: 'views',
      primitiveType: PrimitiveType.NUMBER,
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

export interface PostEntryViewed {
  postEntryId?: string,
  viewerId?: string,
  viewTimestamp?: number,
}

export let POST_ENTRY_VIEWED: MessageDescriptor<PostEntryViewed> = {
  name: 'PostEntryViewed',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntryId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'viewerId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'viewTimestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};

export enum Reaction {
  unknown = 0,
  upvote = 1,
  downvote = 2,
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
  ]
}

export interface PostEntryReacted {
  postEntryId?: string,
  reactorId?: string,
  reaction?: Reaction,
  reactedTimestamp?: number,
}

export let POST_ENTRY_REACTED: MessageDescriptor<PostEntryReacted> = {
  name: 'PostEntryReacted',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'postEntryId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'reactorId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'reaction',
      enumDescriptor: REACTION,
    },
    {
      name: 'reactedTimestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
