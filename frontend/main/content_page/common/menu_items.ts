import { SCHEME } from "../../common/color_scheme";
import {
  createAccountIcon,
  createArrowIcon,
  createHomeIcon,
  createPlusIcon,
  createShuffleIcon,
} from "../../common/icons";
import { LOCALIZED_TEXT } from "../../common/locales/localized_text";
import { MenuItem } from "./menu_item";

export function createHomeMenuItem(showed: boolean): MenuItem {
  return MenuItem.create(
    createHomeIcon(SCHEME.neutral1),
    `1rem`,
    LOCALIZED_TEXT.homeLabel,
    showed
  );
}

export function createShuffleMenuItem(showed: boolean): MenuItem {
  return MenuItem.create(
    createShuffleIcon(SCHEME.neutral1),
    `1rem`,
    LOCALIZED_TEXT.shuffleTalesLabel,
    showed
  );
}

export function createWritePostMenuItem(showed: boolean): MenuItem {
  return MenuItem.create(
    createPlusIcon(SCHEME.neutral1),
    `1rem`,
    LOCALIZED_TEXT.writeTaleLabel,
    showed
  );
}

export function createAccountMenuItem(showed: boolean): MenuItem {
  return MenuItem.create(
    createAccountIcon(SCHEME.neutral1),
    `1rem`,
    LOCALIZED_TEXT.accountLabel,
    showed
  );
}

export function createBackMenuItem(showed: boolean): MenuItem {
  return MenuItem.create(
    createArrowIcon(SCHEME.neutral1),
    `1rem`,
    LOCALIZED_TEXT.backLabel,
    showed
  );
}
