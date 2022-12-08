import { E } from "@selfage/element/factory";

export function createPlusIcon(color: string): SVGSVGElement {
  return E.svg(
    {
      class: "plus-icon",
      style: `height: 100%;`,
      viewBox: "0 0 200 200",
      fill: color,
    },
    E.path({
      d: `M25 85 h150 v30 h-150 z  M85 25 h30 v150 h-30 z`,
    })
  );
}

export function createMinusIcon(color: string): SVGSVGElement {
  return E.svg(
    {
      class: "plus-icon",
      style: `height: 100%;`,
      viewBox: "0 0 200 200",
      fill: color,
    },
    E.path({
      d: `M25 85 h150 v30 h-150 z`,
    })
  );
}

export function createArrowIcon(color: string): SVGSVGElement {
  return E.svg(
    {
      class: "arrow-icon",
      style: `height: 100%;`,
      viewBox: "0 0 200 200",
      fill: color,
    },
    E.path({
      d: `M115 40 L55 100 L115 160 L130 145 L85 100 L130 55 z`,
    })
  );
}

export function createArrowWithBarIcon(color: string): SVGSVGElement {
  return E.svg(
    {
      class: "arrow-with-bar-icon",
      style: `height: 100%;`,
      viewBox: "0 0 200 200",
      fill: color,
    },
    E.path({
      d: `M25 40 L25 160 L45 160 L45 40 z  M115 40 L55 100 L115 160 L130 145 L85 100 L130 55 z`,
    })
  );
}

export function createTrashCanIcon(color: string): SVGSVGElement {
  return E.svg(
    {
      style: `height: 100%; rotate: 180deg;`,
      viewBox: "-310 -360 2000 2000",
      fill: color,
    },
    E.path({
      d: `M 512,800 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z m 256,0 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z m 256,0 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z M 1152,76 v 948 H 256 V 76 Q 256,54 263,35.5 270,17 277.5,8.5 285,0 288,0 h 832 q 3,0 10.5,8.5 7.5,8.5 14.5,27 7,18.5 7,40.5 z M 480,1152 h 448 l -48,117 q -7,9 -17,11 H 546 q -10,-2 -17,-11 z m 928,-32 v -64 q 0,-14 -9,-23 -9,-9 -23,-9 h -96 V 76 q 0,-83 -47,-143.5 -47,-60.5 -113,-60.5 H 288 q -66,0 -113,58.5 Q 128,-11 128,72 v 952 H 32 q -14,0 -23,9 -9,9 -9,23 v 64 q 0,14 9,23 9,9 23,9 h 309 l 70,167 q 15,37 54,63 39,26 79,26 h 320 q 40,0 79,-26 39,-26 54,-63 l 70,-167 h 309 q 14,0 23,-9 9,-9 9,-23 z`,
    })
  );
}

export function createExpandIcon(color: string): SVGSVGElement {
  return E.svg(
    {
      class: "plus-icon",
      style: `height: 100%;`,
      viewBox: "0 0 200 200",
      fill: color,
    },
    E.path({
      d: `M20 180 h70 v-20 h-36 L93 120 L80 106 L40 146 v-36 h-20 z  M180 20 h-70 v20 h36 L106 80 L120 93 L160 54 v36 h20 z`,
    })
  );
}
