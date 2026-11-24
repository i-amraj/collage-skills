/**
 * Ransom kit: the vintage engraving collage look for vertical, voice-synced explainers (1080x1920).
 * Colour cutouts with a white sticker edge, words cut out of magazines letter by letter, crumpled grey paper,
 * torn newspaper scraps, flat red / blue / yellow paper shapes and a pencil grid. Pair it with HELPERS from
 * collage-kit.mjs (enter, pop, slam, draw, boil) for the stop-motion motion.
 *
 *   import { RFONTS, RCSS, RDEFS, ground, sticker, ransom, ransomIn, circle, half, grid, news, strip, RHELPERS } from "./ransom-kit.mjs";
 */
export const RFONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Bodoni+Moda:ital,wght@0,800;1,800&family=Courier+Prime:wght@700&family=Playfair+Display:wght@900&family=Oswald:wght@700&family=Abril+Fatface&display=swap" />`;

export const RPAL = { paper: "#D9D5CE", red: "#C8302B", blue: "#2343A8", yellow: "#E9B43A", ink: "#151311", cream: "#F3EEE4" };

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
/** Re-seed so a film builds the same way every time. */
export const reseed = (s) => { seed = s; };

const tornPath = (w, h, amp = 10, step = 18) => {
  const p = [], j = () => (rnd() * amp).toFixed(1);
  for (let x = 0; x <= w; x += step) p.push(`${x}px ${j()}px`);
  for (let y = 0; y <= h; y += step) p.push(`${(w - j()).toFixed(1)}px ${y}px`);
  for (let x = w; x >= 0; x -= step) p.push(`${x}px ${(h - j()).toFixed(1)}px`);
  for (let y = h; y >= 0; y -= step) p.push(`${j()}px ${y}px`);
  return `polygon(${p.join(",")})`;
};

/** Full-frame crumpled paper (drawn by an SVG lighting filter, no image needed). tint: a colour laid over it. */
export const ground = (id = "ground", tint = "#D9D5CE") => `<div id="${id}" class="rk-ground" style="background:${tint};"><svg width="1080" height="1920" viewBox="0 0 1080 1920"><filter id="${id}f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.009 0.012" numOctaves="4" seed="9" result="n"/><feDiffuseLighting in="n" surfaceScale="5" diffuseConstant="1.05" lighting-color="#fff" result="l"><feDistantLight azimuth="235" elevation="48"/></feDiffuseLighting><feColorMatrix in="l" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.2 0 0 0 1.05" result="shade"/></filter><rect width="1080" height="1920" filter="url(#${id}f)" opacity="0.55"/><filter id="${id}g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/></filter><rect width="1080" height="1920" filter="url(#${id}g)" opacity="0.5"/></svg></div>`;

/** A colour cutout (transparent PNG) with a white sticker edge and a soft shadow. Animate the wrapper #id. */
export const sticker = (id, src, x, y, w, extra = "") => `<div class="rk-it" id="${id}" style="left:${x}px; top:${y}px; width:${w}px; ${extra}"><img class="rk-cut" src="${src}" alt="" /></div>`;

const FACES = [
  ["Anton", "#151311", "#F3EEE4"], ["Bodoni Moda", "#F3EEE4", "#151311"], ["Archivo Black", "#C8302B", "#F3EEE4"],
  ["Abril Fatface", "#F3EEE4", "#C8302B"], ["Courier Prime", "#E9B43A", "#151311"], ["Oswald", "#2343A8", "#F3EEE4"],
  ["Playfair Display", "#F3EEE4", "#2343A8"], ["Anton", "#F3EEE4", "#151311"], ["Bodoni Moda", "#151311", "#E9B43A"],
];
/** A word cut out of magazines, one letter per scrap. Centred on x. size = letter height in px. */
export const ransom = (id, word, x, y, size = 92) => {
  const letters = [...word].map((ch, i) => {
    if (ch === " ") return `<span class="rk-sp" style="width:${size * 0.35}px"></span>`;
    const [font, bg, fg] = FACES[Math.floor(rnd() * FACES.length)];
    const rot = ((rnd() - 0.5) * 12).toFixed(1), dy = ((rnd() - 0.5) * size * 0.16).toFixed(0), s = (0.86 + rnd() * 0.3).toFixed(2);
    const it = rnd() > 0.7 ? "italic" : "normal";
    return `<span class="rk-l" id="${id}_${i}" style="font-family:'${font}'; background:${bg}; color:${fg}; font-style:${it}; transform: translateY(${dy}px) rotate(${rot}deg) scale(${s});">${ch}</span>`;
  }).join("");
  return `<div class="rk-word" id="${id}" style="left:${x}px; top:${y}px; font-size:${size}px;">${letters}</div>`;
};
/** Flat paper circle, half circle, pencil grid, torn newspaper scrap and a torn colour strip. */
export const circle = (id, cx, cy, r, color) => `<div class="rk-shape" id="${id}" style="left:${cx - r}px; top:${cy - r}px; width:${2 * r}px; height:${2 * r}px; border-radius:50%; background:${color};"></div>`;
export const half = (id, cx, cy, r, color, up = true) => `<div class="rk-shape" id="${id}" style="left:${cx - r}px; top:${up ? cy - r : cy}px; width:${2 * r}px; height:${r}px; border-radius:${up ? `${r}px ${r}px 0 0` : `0 0 ${r}px ${r}px`}; background:${color};"></div>`;
export const grid = (id, x, y, w, h, step = 38) => `<svg class="rk-shape" id="${id}" style="left:${x}px; top:${y}px;" width="${w}" height="${h}">${Array.from({ length: Math.floor(w / step) + 1 }, (_, i) => `<path d="M${i * step + 0.5} 0 V${h}"/>`).join("")}${Array.from({ length: Math.floor(h / step) + 1 }, (_, i) => `<path d="M0 ${i * step + 0.5} H${w}"/>`).join("")}</svg>`;
export const news = (id, x, y, w, h, rot = 0) => {
  const lines = Array.from({ length: Math.floor(h / 15) }, (_, i) => { const lw = (0.55 + rnd() * 0.45) * (w / 2 - 26); return `<i style="top:${12 + i * 15}px; left:14px; width:${lw.toFixed(0)}px"></i><i style="top:${12 + i * 15}px; left:${w / 2 + 6}px; width:${((0.55 + rnd() * 0.45) * (w / 2 - 26)).toFixed(0)}px"></i>`; }).join("");
  return `<div class="rk-news" id="${id}" style="left:${x}px; top:${y}px; width:${w}px; height:${h}px; clip-path:${tornPath(w, h, 12, 16)}; transform: rotate(${rot}deg);">${lines}</div>`;
};
export const strip = (id, x, y, w, h, color, rot = 0) => `<div class="rk-shape" id="${id}" style="left:${x}px; top:${y}px; width:${w}px; height:${h}px; background:${color}; clip-path:${tornPath(w, h, 7, 14)}; transform: rotate(${rot}deg);"></div>`;

/** Little marker doodles that pop in next to pieces: a sparkle, a lightning bolt or a scribble ring. */
export const doodle = (id, x, y, size = 46, kind = "spark", color = "#151311") => {
  const d = kind === "bolt" ? "M28 2 L10 30 L24 30 L16 58 L42 22 L27 22 L36 2 Z" : kind === "ring" ? "M8 30 C 6 12, 50 6, 54 26 C 58 46, 14 54, 9 36 C 6 24, 30 14, 46 18" : "M30 2 C 32 22, 38 28, 58 30 C 38 32, 32 38, 30 58 C 28 38, 22 32, 2 30 C 22 28, 28 22, 30 2 Z";
  const fill = kind === "ring" ? `fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"` : `fill="${color}"`;
  return `<svg class="rk-shape" id="${id}" style="left:${x}px; top:${y}px;" width="${size}" height="${size}" viewBox="0 0 60 60"><path d="${d}" ${fill}/></svg>`;
};

export const RCSS = `
  .rk-ground { position: absolute; inset: 0; }
  .rk-ground svg { position: absolute; inset: 0; mix-blend-mode: multiply; }
  .rk-it, .rk-shape, .rk-word, .rk-news { position: absolute; opacity: 0; }
  .rk-it img { width: 100%; display: block; filter: url(#rk-sticker); }
  .rk-grid path, svg.rk-shape path { stroke: #151311; stroke-width: 1.4; opacity: 0.55; fill: none; }
  .rk-word { display: flex; align-items: center; transform: translateX(-50%); white-space: nowrap; filter: drop-shadow(0 6px 6px rgba(0,0,0,0.35)); }
  .rk-l { display: inline-block; padding: 0.04em 0.12em 0.02em; margin: 0 0.02em; line-height: 1; font-weight: 900; opacity: 0; }
  .rk-sp { display: inline-block; }
  .rk-news { background: #ECE6DA; box-shadow: 0 6px 14px rgba(0,0,0,0.25); }
  .rk-news i { position: absolute; height: 5px; background: #8E8579; opacity: 0.7; }
`;

/** The sticker filter: a white paper edge and a soft drop shadow around the cutout, colours kept. */
export const RDEFS = `<svg width="0" height="0" style="position:absolute">
  <filter id="rk-sticker" x="-12%" y="-12%" width="124%" height="128%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="dilate" radius="9" result="a1" />
    <feFlood flood-color="#F7F3EA" /><feComposite in2="a1" operator="in" result="edge" />
    <feGaussianBlur in="a1" stdDeviation="10" result="sb" /><feOffset in="sb" dy="14" result="so" />
    <feFlood flood-color="#000" flood-opacity="0.35" /><feComposite in2="so" operator="in" result="sh" />
    <feComponentTransfer in="SourceGraphic" result="pop"><feFuncR type="linear" slope="1.08" intercept="-0.02"/><feFuncG type="linear" slope="1.08" intercept="-0.02"/><feFuncB type="linear" slope="1.05" intercept="-0.02"/></feComponentTransfer>
    <feMerge><feMergeNode in="sh" /><feMergeNode in="edge" /><feMergeNode in="pop" /></feMerge>
  </filter>
</svg>`;

/**
 * Paste after HELPERS from collage-kit.mjs.
 * ransomIn("#w1", 3.2, 0.06): letters land one by one, each with a stop-motion kick.
 * shapeIn("#c1", 1.0): a paper shape grows in from its centre.
 */
export const RHELPERS = `
    const ransomIn = (sel, at, gap) => { gap = gap || 0.06; 
      document.querySelectorAll(sel + " .rk-l").forEach((el, i) => tl.fromTo(el, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.16, ease: sm("power3.out", 0.16), immediateRender: false }, at + i * gap));
      tl.set(sel, { opacity: 1 }, 0); };
    const shapeIn = (sel, at, d) => tl.fromTo(sel, { opacity: 1, scale: 0 }, { opacity: 1, scale: 1, duration: d || 0.4, ease: sm("back.out(1.3)", d || 0.4), immediateRender: false }, at);
    const out = (sel, at, d) => tl.to(sel, { opacity: 0, duration: d || 0.12, ease: "none" }, at);`;
