let LIGHT_BLACK = "rgb(50, 50, 50)";
let GREY = "rgb(200, 200, 200)";
let DARK_GREY = "rgb(120, 120, 120)";
let LIGHT_BLUE = "rgb(200, 247, 255)";
let BLUE = "rgb(0, 174, 239)";
let WHITE = "white";

export class BrightScheme {
  get normalText() {
    return LIGHT_BLACK;
  }
  get hintText() {
    return DARK_GREY;
  }
  get inputBorder() {
    return GREY;
  }
  get primaryButtonBackground() {
    return BLUE;
  }
  get primaryButtonBackgroundPressed() {
    return LIGHT_BLUE;
  }
  get primaryButtonBackgroundDisabled() {
    return LIGHT_BLUE;
  }
  get primaryButtonText() {
    return WHITE;
  }
  get textButtonBackground() {
    return WHITE;
  }
  get textButtonBackgroundPressed() {
    return GREY;
  }
  get textButtonBackgroundDisabled() {
    return GREY;
  }
  get textButtonText() {
    return LIGHT_BLACK;
  }
}

export class ColorScheme {
  public static SCHEME: BrightScheme = new BrightScheme();
}
