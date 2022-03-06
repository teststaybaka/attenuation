import EventEmitter = require("events");
import { MainContentState } from "./main_content_state";
import { E } from "@selfage/element/factory";

export interface MainContentComponent {
  on(event: "signOut", listener: () => void): this;
}

export class MainContentComponent extends EventEmitter {
  public body: HTMLDivElement;

  public constructor(private state: MainContentState) {
    super();
    this.body = E.div({
      class: "main-content",
    });
  }

  public static create(state: MainContentState): MainContentComponent {
    return new MainContentComponent(state);
  }

  public remove(): void {
    this.body.remove();
  }
}
