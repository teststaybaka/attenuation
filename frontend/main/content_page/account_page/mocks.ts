import userImage = require("./test_data/user_image.jpg");
import { GetUserInfoResponse } from "../../../../interface/user_service";
import { AccountBasicTab } from "./account_basic_tab";
import { AvatarCanvas } from "./avatar_canvas";
import { ChangeAvatarTab } from "./change_avatar_tab";
import { AccountPage } from "./container";
import { Counter } from "@selfage/counter";

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
}

export class ChangeAvatarTabMock extends ChangeAvatarTab {
  public counter = new Counter<string>();

  public constructor() {
    super(new AvatarCanvasMock(), undefined);
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
        avatarLargePath: userImage,
      }),
      new ChangeAvatarTabMock()
    );
  }
}
