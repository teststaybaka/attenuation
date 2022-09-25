import path = require("path");
import { GetUserInfoResponse } from "../../../../interface/service";
import { AvatarUrlComposer } from "../../common/avatar_url_composer";
import { FillButton, OutlineButton } from "../../common/button";
import { AccountBasicTab } from "./account_basic_tab";
import { AvatarCanvas } from "./avatar_canvas";
import { ChangeAvatarTab } from "./change_avatar_tab";
import { AccountPage } from "./container";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";

export class AccountBasicTabMock extends AccountBasicTab {
  public counter = new Counter<string>();

  public constructor(private response: GetUserInfoResponse) {
    super(undefined);
  }

  protected loadBasicUserData(): Promise<GetUserInfoResponse> {
    return Promise.resolve(this.response);
  }
}

export class AvatarCanvasMock extends AvatarCanvas {
  public counter = new Counter<string>();

  public constructor() {
    super();
  }
}

export class ChangeAvatarTabMock extends ChangeAvatarTab {
  public counter = new Counter<string>();

  public constructor() {
    super(
      new AvatarCanvasMock(),
      OutlineButton.create(true, E.text("Choose an image file")),
      FillButton.create(false, E.text("Upload")),
      undefined
    );
  }

  protected async sendUploadAvatarRequest(): Promise<void> {}
}

export class AccountPageMock extends AccountPage {
  public counter = new Counter<string>();

  public constructor() {
    super(
      new AccountBasicTabMock({
        username: "some user name",
        naturalName: "Mr. Your Name",
        email: "xxxxx@gmail.com",
        avatarLargePath: AvatarUrlComposer.compose(
          path.join(__dirname, "../common/user_image.jpg")
        ),
      }),
      new ChangeAvatarTabMock()
    );
  }
}
