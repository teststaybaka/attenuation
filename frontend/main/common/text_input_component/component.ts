import EventEmitter = require("events");
import { SCHEME } from "../color_scheme";
import { E } from "@selfage/element/factory";
import { TextInputController } from "@selfage/element/text_input_controller";
import { Ref } from "@selfage/ref";

export declare interface TextInputComponent {
  on(event: "enter", listener: () => Promise<void> | void): this;
}

export class TextInputComponent extends EventEmitter {
  public body: HTMLDivElement;
  private input: HTMLInputElement;
  private inputController: TextInputController;
  private errorMsg: HTMLDivElement;

  public constructor(label: string) {
    super();
    let inputRef = new Ref<HTMLInputElement>();
    let errorMsgRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "text-input",
        style: `display: flex; flex-flow: row nowrap; width: 100%; height: 4rem;`,
      },
      E.div(
        {
          class: "text-input-label",
          style: `flex: 0 0 12rem; font-size: 1.4rem; line-height: 2rem; color: ${SCHEME.normalText};`,
        },
        E.text(label)
      ),
      E.div(
        {
          class: "text-input-container",
          style: `flex: 1 0 0;`,
        },
        E.inputRef(inputRef, {
          class: "text-input-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; width: 100%; font-size: 1.4rem; font-family: initial; line-height: 2rem; color: ${SCHEME.normalText}; border-bottom: .1rem solid;`,
        }),
        E.divRef(errorMsgRef, {
          class: "text-input-error-label",
          style: `width: 100%; font-size: 1.2rem; line-height: 1.9rem; color: ${SCHEME.errorText};`,
        })
      )
    );
    this.input = inputRef.val;
    this.errorMsg = errorMsgRef.val;
  }

  public static create(label: string): TextInputComponent {
    return new TextInputComponent(label).init();
  }

  public init(): this {
    this.inputController = new TextInputController(this.input);
    this.inputController.on("enter", () => this.enter());
    this.hideError();
    return this;
  }

  public enter(): void {
    this.emit("enter");
  }

  public showError(desc: string): void {
    this.errorMsg.textContent = desc;
    this.input.style.borderColor = SCHEME.errorInputBorder;
  }

  public hideError(): void {
    this.errorMsg.textContent = "";
    this.input.style.borderColor = SCHEME.inputBorder;
  }

  public setValue(value: string): void {
    this.input.value = value;
  }
}
