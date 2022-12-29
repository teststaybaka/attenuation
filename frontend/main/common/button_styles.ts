import { SCHEME } from "./color_scheme";

export let BUTTON_BORDER_RADIUS = `.5rem`;
export let COMMON_BUTTON_STYLE = `outline: none; border: 0; flex: 0 0 auto; background-color: initial; font-size: 1.4rem; line-height: 100%; border-radius: ${BUTTON_BORDER_RADIUS}; padding: .8rem 1.2rem; cursor: pointer;`;
export let FILLED_BUTTON_STYLE = `${COMMON_BUTTON_STYLE} color: ${SCHEME.primaryContrast0};`;
export let OUTLINE_BUTTON_STYLE = `${COMMON_BUTTON_STYLE} border: .1rem solid;`;
export let TEXT_BUTTON_STYLE = COMMON_BUTTON_STYLE;
