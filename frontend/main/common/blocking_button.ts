import EventEmitter = require("events");
import { SCHEME } from "./color_scheme";
import { E } from "@selfage/element/factory";

export interface BlockingButton {
  on(event: "action", listener: () => Promise<void>): this;
  on(event: "postAction", listener: (error?: Error) => void): this;
}

export abstract class BlockingButton extends EventEmitter {
  public body: HTMLButtonElement;
  private displayStyle: string;
  private cursorStyle: string;

  public constructor(
    customStyle: string,
    enabled: boolean,
    ...childNodes: Array<Node>
  ) {
    super();
    this.body = E.button(
      {
        class: "blocking-button",
        style: customStyle,
        type: "button",
      },
      ...childNodes
    );
    this.displayStyle = this.body.style.display;
    this.cursorStyle = this.body.style.cursor;
    if (enabled) {
      this.enable();
    } else {
      this.disable();
    }

    this.body.addEventListener("click", () => this.click());
  }

  public async click(): Promise<void> {
    this.disable();
    try {
      await Promise.all(this.listeners("action").map((callback) => callback()));
    } catch (e) {
      this.enable();
      this.emit("postAction", e);
      return;
    }
    this.enable();
    this.emit("postAction");
  }

  public enable(): void {
    this.body.style.cursor = this.cursorStyle;
    this.enableOverride();
  }
  protected abstract enableOverride(): void;

  public disable(): void {
    this.body.style.cursor = "not-allowed";
    this.disableOverride();
  }
  protected abstract disableOverride(): void;

  public show(): void {
    this.body.style.display = this.displayStyle;
  }

  public hide(): void {
    this.body.style.display = "none";
  }

  public remove(): void {
    this.body.remove();
  }
}

let COMMON_BUTTON_STYLE = `outline: none; border: 0; flex: 0 0 auto; background-color: initial; font-size: 1.4rem; line-height: 100%; border-radius: .5rem; padding: .8rem 1.2rem; cursor: pointer;`;

export class FilledBlockingButton extends BlockingButton {
  public constructor(enabled: boolean, ...childNodes: Array<Node>) {
    super(
      `${COMMON_BUTTON_STYLE} color: ${SCHEME.primaryContrast0};`,
      enabled,
      ...childNodes
    );
  }

  public static create(
    enabled: boolean,
    ...childNodes: Array<Node>
  ): FilledBlockingButton {
    return new FilledBlockingButton(enabled, ...childNodes);
  }

  protected enableOverride(): void {
    this.body.style.backgroundColor = SCHEME.primary1;
  }

  protected disableOverride(): void {
    this.body.style.backgroundColor = SCHEME.primary2;
  }
}

export class OutlineBlockingButton extends BlockingButton {
  public constructor(enabled: boolean, ...childNodes: Array<Node>) {
    super(
      `${COMMON_BUTTON_STYLE} border: .1rem solid;`,
      enabled,
      ...childNodes
    );
  }

  public static create(
    enabled: boolean,
    ...childNodes: Array<Node>
  ): OutlineBlockingButton {
    return new OutlineBlockingButton(enabled, ...childNodes);
  }

  protected enableOverride(): void {
    this.body.style.color = SCHEME.neutral0;
    this.body.style.borderColor = SCHEME.neutral1;
  }

  protected disableOverride(): void {
    this.body.style.color = SCHEME.neutral2;
    this.body.style.borderColor = SCHEME.neutral2;
  }
}

export class TextBlockingButton extends BlockingButton {
  public constructor(enabled: boolean, ...childNodes: Array<Node>) {
    super(`${COMMON_BUTTON_STYLE}`, enabled, ...childNodes);
  }

  public static create(
    enabled: boolean,
    ...childNodes: Array<Node>
  ): TextBlockingButton {
    return new TextBlockingButton(enabled, ...childNodes);
  }

  public init(): this {
    this.enable();
    return this;
  }

  protected enableOverride(): void {
    this.body.style.color = SCHEME.neutral0;
  }

  protected disableOverride(): void {
    this.body.style.color = SCHEME.neutral2;
  }
}
