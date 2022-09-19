import { AvatarCanvasComponent } from "./component";
import { Counter } from "@selfage/counter";

export class AvatarCanvasComponentMock extends AvatarCanvasComponent {
  public counter = new Counter<string>();

  public constructor() {
    super();
  }
}
