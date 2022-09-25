import { SCHEME } from "./color_scheme";
import { BaseButton } from "@selfage/element/base_button";

let COMMON_BUTTON_STYLE = `outline: none; border: 0; flex: 0 0 auto; font-size: 1.4rem; line-height: 100%; border-radius: .5rem; padding: .8rem 1.2rem; cursor: pointer;`;

export class FillButton extends BaseButton {
  public constructor(private enabled: boolean, ...childNodes: Array<Node>) {
    super(`${COMMON_BUTTON_STYLE} color: ${SCHEME.primaryButtonText};`);
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
    this.body.style.backgroundColor = SCHEME.primaryButtonBackground;
  }

  private handleDisable(): void {
    this.body.style.backgroundColor = SCHEME.primaryButtonBackgroundDisabled;
  }

  private handleDown(): void {
    this.body.style.backgroundColor = SCHEME.primaryButtonBackgroundPressed;
  }

  private handleUp(): void {
    this.body.style.backgroundColor = SCHEME.primaryButtonBackground;
  }

  public remove(): void {
    this.body.remove();
  }
}

export class OutlineButton extends BaseButton {
  public constructor(private enabled: boolean, ...childNodes: Array<Node>) {
    super(
      `${COMMON_BUTTON_STYLE}; border: .1rem solid ${SCHEME.outlineButtonBorder}; color: ${SCHEME.outlineButtonText};`
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
    this.body.style.backgroundColor = SCHEME.outlineButtonBackground;
  }

  private handleDisable(): void {
    this.body.style.backgroundColor = SCHEME.outlineButtonBackgroundDisabled;
  }

  private handleDown(): void {
    this.body.style.backgroundColor = SCHEME.outlineButtonBackgroundPressed;
  }

  private handleUp(): void {
    this.body.style.backgroundColor = SCHEME.outlineButtonBackground;
  }

  public remove(): void {
    this.body.remove();
  }
}

export class TextButton extends BaseButton {
  public constructor(private enabled: boolean, ...childNodes: Array<Node>) {
    super(`${COMMON_BUTTON_STYLE}; color: ${SCHEME.textButtonText};`);
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
    this.body.style.backgroundColor = SCHEME.textButtonBackground;
  }

  private handleDisable(): void {
    this.body.style.backgroundColor = SCHEME.textButtonBackgroundDisabled;
  }

  private handleDown(): void {
    this.body.style.backgroundColor = SCHEME.textButtonBackgroundPressed;
  }

  private handleUp(): void {
    this.body.style.backgroundColor = SCHEME.textButtonBackground;
  }

  public remove(): void {
    this.body.remove();
  }
}
