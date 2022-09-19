import {
  FillButtonComponent,
  OutlineButtonComponent,
} from "../../../common/button/component";
import { AvatarCanvasComponentMock } from "./avatar_canvas/mock";
import { ChangeAvatarComponent } from "./component";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";

export class ChangeAvatarComponentMock extends ChangeAvatarComponent {
  public counter = new Counter<string>();

  public constructor() {
    super(
      new AvatarCanvasComponentMock(),
      OutlineButtonComponent.create(true, E.text("Choose an image file")),
      FillButtonComponent.create(false, E.text("Upload")),
      undefined
    );
  }
}
