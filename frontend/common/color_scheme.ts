let LIGHT_BLACK = "rgb(50, 50, 50)";
let LIGHT_GREY = "rgb(230, 230, 230)";
let GREY = "rgb(200, 200, 200)";
let DARK_GREY = "rgb(120, 120, 120)";
let LIGHT_BLUE = "rgb(200, 247, 255)";
let BLUE = "rgb(0, 174, 239)";
let RED = "rgb(255, 0,0)";
let WHITE = "white";

export class LightScheme {
  get bodyBackground() {
    return LIGHT_GREY;
  }
  get cardBackground() {
    return WHITE;
  }
  get normalText() {
    return LIGHT_BLACK;
  }
  get hintText() {
    return DARK_GREY;
  }
  get errorText() {
    return RED;
  }
  get inputBorder() {
    return GREY;
  }
  get errorInputBorder() {
    return RED;
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

export let SCHEME: LightScheme = new LightScheme();
