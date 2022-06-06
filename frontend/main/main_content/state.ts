import { EnumDescriptor, MessageDescriptor } from '@selfage/message/descriptor';
import { EventEmitter } from 'events';

export enum MainContentPage {
  HOME = 1,
  ACCOUNT = 2,
}

export let MAIN_CONTENT_PAGE: EnumDescriptor<MainContentPage> = {
  name: 'MainContentPage',
  values: [
    {
      name: 'HOME',
      value: 1,
    },
    {
      name: 'ACCOUNT',
      value: 2,
    },
  ]
}

export interface MainContentState {
  on(event: 'page', listener: (newValue: MainContentPage, oldValue: MainContentPage) => void): this;
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

  public triggerInitialEvents(): void {
    if (this.page_ !== undefined) {
      this.emit('page', this.page_, undefined);
    }
    this.emit('init');
  }

  public toJSON(): Object {
    return {
      page: this.page,
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
  ]
};
