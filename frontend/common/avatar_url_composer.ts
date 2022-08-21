export class AvatarUrlComposer {
  public static COMMON_DIRECTORY = "";
  public compose(avatarPath: string): string {
    return `${AvatarUrlComposer.COMMON_DIRECTORY}${avatarPath}`;
  }
}

export let AVATAR_URL_COMPOSER = new AvatarUrlComposer();
