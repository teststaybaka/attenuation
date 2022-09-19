import { AccountBasicComponent } from "./component";
import { Counter } from "@selfage/counter";

export class AccountBasicComponentMock extends AccountBasicComponent {
  public counter = new Counter<string>();

  public constructor() {
    super(undefined);
  }
}
