import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface TaleContext {
  taleId?: string,
  userId?: string,
}

export let TALE_CONTEXT: MessageDescriptor<TaleContext> = {
  name: 'TaleContext',
  fields: [
    {
      name: 'taleId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};
