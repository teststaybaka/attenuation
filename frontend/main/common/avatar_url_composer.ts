export class AvatarUrlComposer {
  public static COMMON_DIRECTORY = "";
  public static compose(avatarPath: string): string {
    return `${AvatarUrlComposer.COMMON_DIRECTORY}${avatarPath}`;
  }
}
