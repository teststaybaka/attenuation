import { SCHEME } from "../../common/color_scheme";
import { LOCALIZED_TEXT } from "../../common/locales/localized_text";
import { MenuItem } from "./menu_item/component";
import { E } from "@selfage/element/factory";

export function createHomeMenuIcon(): SVGSVGElement {
  return E.svg(
    {
      class: "menu-home-icon",
      style: `height: 100%`,
      viewBox: "-4 -4 24 24",
      fill: SCHEME.menuIcon,
    },
    E.path({
      d: `M15.45,7L14,5.551V2c0-0.55-0.45-1-1-1h-1c-0.55,0-1,0.45-1,1v0.553L9,0.555C8.727,0.297,8.477,0,8,0S7.273,0.297,7,0.555  L0.55,7C0.238,7.325,0,7.562,0,8c0,0.563,0.432,1,1,1h1v6c0,0.55,0.45,1,1,1h3v-5c0-0.55,0.45-1,1-1h2c0.55,0,1,0.45,1,1v5h3  c0.55,0,1-0.45,1-1V9h1c0.568,0,1-0.437,1-1C16,7.562,15.762,7.325,15.45,7z`,
    })
  );
}

export function createHomeMenuItem(): MenuItem {
  return MenuItem.create(createHomeMenuIcon(), LOCALIZED_TEXT.homeLabel);
}

export function createRefreshMenuIcon(): SVGSVGElement {
  return E.svg(
    {
      class: "menu-refresh-icon",
      style: `height: 100%;`,
      viewBox: "0 0 48 48",
      fill: SCHEME.menuIcon,
    },
    E.path({
      d: `M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z`,
    })
  );
}

export function createRefreshMenuItem(): MenuItem {
  return MenuItem.create(createRefreshMenuIcon(), LOCALIZED_TEXT.refreshLabel);
}

export function createWritePostMenuIcon(): SVGSVGElement {
  return E.svg(
    {
      class: "menu-write-posts-icon",
      style: `height: 100%;`,
      viewBox: "0 0 200 200",
      fill: SCHEME.menuPrimaryIcon,
    },
    E.path({
      d: `M25 80 h150 v40 h-150 z M80 25 h40 v150 h-40 z`,
    })
  );
}

export function createWritePostMenuItem(): MenuItem {
  return MenuItem.create(
    createWritePostMenuIcon(),
    LOCALIZED_TEXT.writePostLabel
  );
}

export function createAccountMenuIcon(): SVGSVGElement {
  return E.svg(
    {
      class: "menu-account-icon",
      style: `height: 100%;`,
      viewBox: "-50 -50 300 300",
      fill: SCHEME.menuIcon,
    },
    E.path({
      d: `M0 200 A105 105 0 0 1 200 200 L0 200 M100 0 A65 65 0 1 1 100 130 A65 65 0 1 1 100 0 z`,
    })
  );
}

export function createAccountMenuItem(): MenuItem {
  return MenuItem.create(createAccountMenuIcon(), LOCALIZED_TEXT.accountLabel);
}

export function createBackMenuIcon(): SVGSVGElement {
  return E.svg(
    {
      class: "menu-account-icon",
      style: `height: 100%;`,
      viewBox: "-50 -50 300 300",
      fill: SCHEME.menuIcon,
    },
    E.path({
      d: `M100 0 A100 100 0 1 1 99.9 0 z  M100 15 A85 85 0 1 0 100.1 15 z  M115 40 L55 100 L115 160 L130 145 L85 100 L130 55 z`,
    })
  );
}

export function createBackMenuItem(): MenuItem {
  return MenuItem.create(createBackMenuIcon(), LOCALIZED_TEXT.backLabel);
}
