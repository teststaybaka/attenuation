import { EnumDescriptor } from '@selfage/message/descriptor';
import { EventEmitter } from 'events';
import { ObservableDescriptor } from '@selfage/observable/descriptor';

export enum Page {
  HOME = 1,
  ACCOUNT = 2,
}

export let PAGE: EnumDescriptor<Page> = {
  name: 'Page',
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

export interface ContentState {
  on(event: 'page', listener: (newValue: Page, oldValue: Page) => void): this;
  on(event: 'init', listener: () => void): this;
}

export class ContentState extends EventEmitter {
  private page_?: Page;
  get page(): Page {
    return this.page_;
  }
  set page(value: Page) {
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

export let CONTENT_STATE: ObservableDescriptor<ContentState> = {
  name: 'ContentState',
  constructor: ContentState,
  fields: [
    {
      name: 'page',
      enumType: PAGE,
    },
  ]
};
