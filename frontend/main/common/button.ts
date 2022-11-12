import { SCHEME } from "./color_scheme";
import { BaseButton } from "@selfage/element/base_button";

let COMMON_BUTTON_STYLE = `outline: none; border: 0; flex: 0 0 auto; background-color: initial; font-size: 1.4rem; line-height: 100%; border-radius: .5rem; padding: .8rem 1.2rem; cursor: pointer;`;

export class FillButton extends BaseButton {
  public constructor(private enabled: boolean, ...childNodes: Array<Node>) {
    super(`${COMMON_BUTTON_STYLE} color: ${SCHEME.primaryContrast0};`);
    this.body.append(...childNodes);
    this.on("enable", () => this.handleEnable());
    this.on("disable", () => this.handleDisable());
    this.on("down", () => this.handleDown());
    this.on("up", () => this.handleUp());
    if (this.enabled) {
      this.enable();
    } else {
      this.disable();
    }
  }

  public static create(
    enabled: boolean,
    ...childNodes: Array<Node>
  ): FillButton {
    return new FillButton(enabled, ...childNodes);
  }

  private handleEnable(): void {
    this.body.style.backgroundColor = SCHEME.primary1;
  }

  private handleDisable(): void {
    this.body.style.backgroundColor = SCHEME.primary2;
  }

  private handleDown(): void {
    this.body.style.backgroundColor = SCHEME.primary2;
  }

  private handleUp(): void {
    this.body.style.backgroundColor = SCHEME.primary1;
  }

  public remove(): void {
    this.body.remove();
  }
}

export class OutlineButton extends BaseButton {
  public constructor(private enabled: boolean, ...childNodes: Array<Node>) {
    super(
      `${COMMON_BUTTON_STYLE} border: .1rem solid;`
    );
    this.body.append(...childNodes);
    this.on("enable", () => this.handleEnable());
    this.on("disable", () => this.handleDisable());
    this.on("down", () => this.handleDown());
    this.on("up", () => this.handleUp());
    if (this.enabled) {
      this.enable();
    } else {
      this.disable();
    }
  }

  public static create(
    enabled: boolean,
    ...childNodes: Array<Node>
  ): OutlineButton {
    return new OutlineButton(enabled, ...childNodes);
  }

  private handleEnable(): void {
    this.body.style.color = SCHEME.neutral0;
    this.body.style.borderColor = SCHEME.neutral1;
  }

  private handleDisable(): void {
    this.body.style.color = SCHEME.neutral2;
    this.body.style.borderColor = SCHEME.neutral2;
  }

  private handleDown(): void {
    this.body.style.color = SCHEME.neutral2;
    this.body.style.borderColor = SCHEME.neutral2;
  }

  private handleUp(): void {
    this.body.style.color = SCHEME.neutral0;
    this.body.style.borderColor = SCHEME.neutral1;
  }

  public remove(): void {
    this.body.remove();
  }
}

export class TextButton extends BaseButton {
  public constructor(private enabled: boolean, ...childNodes: Array<Node>) {
    super(`${COMMON_BUTTON_STYLE}`);
    this.body.append(...childNodes);
    this.on("enable", () => this.handleEnable());
    this.on("disable", () => this.handleDisable());
    this.on("down", () => this.handleDown());
    this.on("up", () => this.handleUp());
    if (this.enabled) {
      this.enable();
    } else {
      this.disable();
    }
  }

  public static create(
    enabled: boolean,
    ...childNodes: Array<Node>
  ): TextButton {
    return new TextButton(enabled, ...childNodes);
  }

  public init(): this {
    this.enable();
    return this;
  }

  private handleEnable(): void {
    this.body.style.color = SCHEME.neutral0;
  }

  private handleDisable(): void {
    this.body.style.color = SCHEME.neutral2;
  }

  private handleDown(): void {
    this.body.style.color = SCHEME.neutral2;
  }

  private handleUp(): void {
    this.body.style.color = SCHEME.neutral0;
  }

  public remove(): void {
    this.body.remove();
  }
}
