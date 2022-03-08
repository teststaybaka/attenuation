import { EventEmitter } from 'events';
import { MessageDescriptor, PrimitiveType, EnumDescriptor } from '@selfage/message/descriptor';

export interface TopicState {
  on(event: 'postEntryId', listener: (newValue: string, oldValue: string) => void): this;
  on(event: 'topic', listener: (newValue: string, oldValue: string) => void): this;
  on(event: 'init', listener: () => void): this;
}

export class TopicState extends EventEmitter {
  private postEntryId_?: string;
  get postEntryId(): string {
    return this.postEntryId_;
  }
  set postEntryId(value: string) {
    let oldValue = this.postEntryId_;
    if (value === oldValue) {
      return;
    }
    this.postEntryId_ = value;
    this.emit('postEntryId', this.postEntryId_, oldValue);
  }

  private topic_?: string;
  get topic(): string {
    return this.topic_;
  }
  set topic(value: string) {
    let oldValue = this.topic_;
    if (value === oldValue) {
      return;
    }
    this.topic_ = value;
    this.emit('topic', this.topic_, oldValue);
  }

  public triggerInitialEvents(): void {
    if (this.postEntryId_ !== undefined) {
      this.emit('postEntryId', this.postEntryId_, undefined);
    }
    if (this.topic_ !== undefined) {
      this.emit('topic', this.topic_, undefined);
    }
    this.emit('init');
  }

  public toJSON(): Object {
    return {
      postEntryId: this.postEntryId,
      topic: this.topic,
    };
  }
}

export let TOPIC_STATE: MessageDescriptor<TopicState> = {
  name: 'TopicState',
  factoryFn: () => {
    return new TopicState();
  },
  fields: [
    {
      name: 'postEntryId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'topic',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export enum MainContentPage {
  HOME = 1,
  TOPIC = 2,
  PROFILE = 3,
  MANAGE_TOPICS = 4,
  FOLLOWERS = 5,
  FOLLOWING = 6,
}

export let MAIN_CONTENT_PAGE: EnumDescriptor<MainContentPage> = {
  name: 'MainContentPage',
  values: [
    {
      name: 'HOME',
      value: 1,
    },
    {
      name: 'TOPIC',
      value: 2,
    },
    {
      name: 'PROFILE',
      value: 3,
    },
    {
      name: 'MANAGE_TOPICS',
      value: 4,
    },
    {
      name: 'FOLLOWERS',
      value: 5,
    },
    {
      name: 'FOLLOWING',
      value: 6,
    },
  ]
}

export interface MainContentState {
  on(event: 'page', listener: (newValue: MainContentPage, oldValue: MainContentPage) => void): this;
  on(event: 'topicState', listener: (newValue: TopicState, oldValue: TopicState) => void): this;
  on(event: 'init', listener: () => void): this;
}

export class MainContentState extends EventEmitter {
  private page_?: MainContentPage;
  get page(): MainContentPage {
    return this.page_;
  }
  set page(value: MainContentPage) {
    let oldValue = this.page_;
    if (value === oldValue) {
      return;
    }
    this.page_ = value;
    this.emit('page', this.page_, oldValue);
  }

  private topicState_?: TopicState;
  get topicState(): TopicState {
    return this.topicState_;
  }
  set topicState(value: TopicState) {
    let oldValue = this.topicState_;
    if (value === oldValue) {
      return;
    }
    this.topicState_ = value;
    this.emit('topicState', this.topicState_, oldValue);
  }

  public triggerInitialEvents(): void {
    if (this.page_ !== undefined) {
      this.emit('page', this.page_, undefined);
    }
    if (this.topicState_ !== undefined) {
      this.emit('topicState', this.topicState_, undefined);
    }
    this.emit('init');
  }

  public toJSON(): Object {
    return {
      page: this.page,
      topicState: this.topicState,
    };
  }
}

export let MAIN_CONTENT_STATE: MessageDescriptor<MainContentState> = {
  name: 'MainContentState',
  factoryFn: () => {
    return new MainContentState();
  },
  fields: [
    {
      name: 'page',
      enumDescriptor: MAIN_CONTENT_PAGE,
    },
    {
      name: 'topicState',
      messageDescriptor: TOPIC_STATE,
    },
  ]
};
