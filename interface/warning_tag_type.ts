import { EnumDescriptor } from '@selfage/message/descriptor';

export enum WarningTagType {
  Unknown = 0,
  Nudity = 1,
  Spoiler = 2,
  Gross = 3,
}

export let WARNING_TAG_TYPE: EnumDescriptor<WarningTagType> = {
  name: 'WarningTagType',
  values: [
    {
      name: 'Unknown',
      value: 0,
    },
    {
      name: 'Nudity',
      value: 1,
    },
    {
      name: 'Spoiler',
      value: 2,
    },
    {
      name: 'Gross',
      value: 3,
    },
  ]
}
