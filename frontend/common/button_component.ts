import EventEmitter = require("events");
import { SCHEME } from "./color_scheme";
import { ButtonController } from "@selfage/element/button_controller";
import { E } from "@selfage/element/factory";

let COMMON_BUTTON_STYLE = `outline: none; border: 0; flex: 0 0 auto; font-size: 1.4rem; line-height: 100%; border-radius: .5rem; padding: .8rem 1.2rem; cursor: pointer;`;

export declare interface FillButtonComponent {
  on(
    event: "click",
    listener: () => boolean | void | Promise<boolean | void>
  ): this;
}

export class FillButtonComponent extends EventEmitter {
  public body: HTMLButtonElement;
  private controller: ButtonController;

  public constructor(
    private enabled: boolean,
    childNodes: Array<Node>,
    private buttonControllerFactoryFn: (
      button: HTMLButtonElement
    ) => ButtonController
  ) {
    super();
    this.body = E.button(
      {
        class: "fill-button",
        style: `${COMMON_BUTTON_STYLE} color: ${SCHEME.primaryButtonText};`,
      },
      ...childNodes
    );
  }

  public static create(
    enabled: boolean,
    ...childNodes: Array<Node>
  ): FillButtonComponent {
    return new FillButtonComponent(
      enabled,
      childNodes,
      ButtonController.create
    ).init();
  }

  public init(): this {
    this.controller = this.buttonControllerFactoryFn(this.body);
    this.controller.on("enable", () => this.handleEnable());
    this.controller.on("disable", () => this.handleDisable());
    this.controller.on("down", () => this.down());
    this.controller.on("up", () => this.up());
    this.controller.on("click", () => this.handleClick());
    if (this.enabled) {
      this.enable();
    } else {
      this.disable();
    }
    return this;
  }

  private handleEnable(): void {
    this.body.style.backgroundColor = SCHEME.primaryButtonBackground;
  }

  private handleDisable(): void {
    this.body.style.backgroundColor = SCHEME.primaryButtonBackgroundDisabled;
  }

  private down(): void {
    this.body.style.backgroundColor = SCHEME.primaryButtonBackgroundPressed;
  }

  private up(): void {
    this.body.style.backgroundColor = SCHEME.primaryButtonBackground;
  }

  private async handleClick(): Promise<boolean> {
    return (
      await Promise.all(this.listeners("click").map((callback) => callback()))
    ).some((keepDisabled) => keepDisabled);
  }

  public async click(): Promise<void> {
    await this.controller.click();
  }

  public enable(): void {
    this.controller.enable();
  }

  public disable(): void {
    this.controller.disable();
  }

  public hide(): void {
    this.controller.hide();
  }

  public show(): void {
    this.controller.show();
  }

  public remove(): void {
    this.body.remove();
  }
}

export declare interface TextButtonComponent {
  on(
    event: "click",
    listener: () => boolean | void | Promise<boolean | void>
  ): this;
}

export class TextButtonComponent extends EventEmitter {
  public body: HTMLButtonElement;
  private controller: ButtonController;

  public constructor(
    private enabled: boolean,
    childNodes: Array<Node>,
    private buttonControllerFactoryFn: (
      button: HTMLButtonElement
    ) => ButtonController
  ) {
    super();
    this.body = E.button(
      {
        class: "text-button",
        style: `${COMMON_BUTTON_STYLE}; color: ${SCHEME.textButtonText};`,
      },
      ...childNodes
    );
  }

  public static create(
    enabled: boolean,
    ...childNodes: Array<Node>
  ): TextButtonComponent {
    return new TextButtonComponent(
      enabled,
      childNodes,
      ButtonController.create
    ).init();
  }

  public init(): this {
    this.controller = this.buttonControllerFactoryFn(this.body);
    this.controller.on("enable", () => this.handleEnable());
    this.controller.on("disable", () => this.handleDisable());
    this.controller.on("down", () => this.down());
    this.controller.on("up", () => this.up());
    this.controller.on("click", () => this.handleClick());
    if (this.enabled) {
      this.enable();
    } else {
      this.disable();
    }
    this.enable();
    return this;
  }

  private handleEnable(): void {
    this.body.style.backgroundColor = SCHEME.textButtonBackground;
  }

  private handleDisable(): void {
    this.body.style.backgroundColor = SCHEME.textButtonBackgroundDisabled;
  }

  private down(): void {
    this.body.style.backgroundColor = SCHEME.textButtonBackgroundPressed;
  }

  private up(): void {
    this.body.style.backgroundColor = SCHEME.textButtonBackground;
  }

  private async handleClick(): Promise<boolean> {
    return (
      await Promise.all(this.listeners("click").map((callback) => callback()))
    ).some((keepDisabled) => keepDisabled);
  }

  public async click(): Promise<void> {
    await this.controller.click();
  }

  public enable(): void {
    this.controller.enable();
  }

  public disable(): void {
    this.controller.disable();
  }

  public hide(): void {
    this.controller.hide();
  }

  public show(): void {
    this.controller.show();
  }

  public remove(): void {
    this.body.remove();
  }
}
