let LIGHT_BLACK = "rgb(50, 50, 50)";
let LIGHT_GREY = "rgb(230, 230, 230)";
let GREY = "rgb(200, 200, 200)";
let GREY_TRANSLUCENT = "rgba(200, 200, 200, .5)";
let DARK_GREY = "rgb(120, 120, 120)";
let LIGHT_BLUE = "rgb(200, 247, 255)";
let BLUE = "rgb(0, 174, 239)";
let ORANGE = "rgb(255, 180, 80)";
let RED = "rgb(255, 0,0)";
let WHITE = "white";

export class LightScheme {
  get normalText() {
    return LIGHT_BLACK;
  }
  get hintText() {
    return DARK_GREY;
  }
  get errorText() {
    return RED;
  }
  get shadowText() {
    return WHITE;
  }
  get textButtonText() {
    return LIGHT_BLACK;
  }
  get primaryButtonText() {
    return WHITE;
  }
  get menuText() {
    return LIGHT_BLACK;
  }
  get logoOrange() {
    return ORANGE;
  }
  get logoBlue() {
    return BLUE;
  }
  get menuPrimaryIcon() {
    return BLUE;
  }
  get menuIcon() {
    return LIGHT_BLACK;
  }
  get shadowCover() {
    return GREY_TRANSLUCENT;
  }
  get inputBorder() {
    return GREY;
  }
  get errorInputBorder() {
    return RED;
  }
  get resizeLineBorder() {
    return BLUE;
  }
  get bodyBackground() {
    return LIGHT_GREY;
  }
  get cardBackground() {
    return WHITE;
  }
  get barBackground() {
    return WHITE;
  }
  get placeholderBackground() {
    return LIGHT_GREY;
  }
  get menuHighlightBackground() {
    return LIGHT_BLUE;
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
  get textButtonBackground() {
    return WHITE;
  }
  get textButtonBackgroundPressed() {
    return GREY;
  }
  get textButtonBackgroundDisabled() {
    return GREY;
  }
  get resizePointBackground() {
    return WHITE;
  }
}

export let SCHEME: LightScheme = new LightScheme();
