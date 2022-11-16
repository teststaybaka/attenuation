import { QuickLayoutEditor } from "./container";
import { ImageEditor } from "./image_editor";

export class ImageEditorMock extends ImageEditor {
  public moveUp(): void {
    this.moveUpButton.click();
  }
  public moveToTop(): void {
    this.moveToTopButton.click();
  }
  public moveDown(): void {
    this.moveDownButton.click();
  }
  public moveToBottom(): void {
    this.moveToBottomButton.click();
  }
  public delete(): void {
    this.deleteButton.click();
  }
}

export class QuickLayoutEditorMock extends QuickLayoutEditor {
  public constructor() {
    super((imageUrl) => new ImageEditorMock(imageUrl), undefined);
  }
  public chnageTextInput(text: string): void {
    this.textInput.value = text;
    this.checkValidity();
  }
  public addImage(imageUrl: string): void {
    this.addImageEditor(imageUrl);
    this.checkValidity();
  }
}
