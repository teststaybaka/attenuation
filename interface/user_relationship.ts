import { EnumDescriptor } from '@selfage/message/descriptor';

export enum UserRelationship {
  UNKNOWN = 0,
  LIKE = 1,
  DISLIKE = 2,
}

export let USER_RELATIONSHIP: EnumDescriptor<UserRelationship> = {
  name: 'UserRelationship',
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
  ]
}
