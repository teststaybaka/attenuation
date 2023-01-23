import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { UserRelationship, USER_RELATIONSHIP } from './user_relationship';

export interface UserInfoCard {
  userId?: string,
  username?: string,
  naturalName?: string,
  description?: string,
  avatarLargePath?: string,
  relationship?: UserRelationship,
}

export let USER_INFO_CARD: MessageDescriptor<UserInfoCard> = {
  name: 'UserInfoCard',
  fields: [
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'username',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'naturalName',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'description',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'avatarLargePath',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'relationship',
      enumType: USER_RELATIONSHIP,
    },
  ]
};
