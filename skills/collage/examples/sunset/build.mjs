#!/usr/bin/env node
/**
 * Example: "Why sunsets are orange", an 19 s vertical engraving collage synced to a voiceover (1080x1920).
 * Pieces are public-domain engravings and photos (CREDITS.txt), cut out with tools/lift or tools/cutout.mjs and
 * built with kit/ransom-kit.mjs. Every beat is timed from the voice: transcript.json comes from
 * `npx -y hyperframes@0.8.33 transcribe voice.wav` (word, start, end). Put the voice next to this file as
 * voice.wav and it plays in preview; the render is mixed with tools/mix.mjs --voice voice.wav.
 *   node build.mjs && npx -y hyperframes@0.8.33 lint .
 */
import { readFileSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { HELPERS, route } from "../../kit/collage-kit.mjs";
import { RFONTS, RCSS, RDEFS, RPAL, ground, sticker, ransom, circle, half, grid, news, strip, doodle, RHELPERS, reseed } from "../../kit/ransom-kit.mjs";

/* words with their times: [{ w, T, TE }] from the transcript */
const W = JSON.parse(readFileSync(new URL("./transcript.json", import.meta.url), "utf8")).map(x => ({ w: x.text, T: x.start, TE: x.end }));
const VOICE = existsSync(new URL("./voice.wav", import.meta.url));
const DUR = +(W.at(-1).TE + 0.7).toFixed(2);
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9']/g, "");
const f2 = (x) => (+x).toFixed(2);
const T = (word, n = 1) => { let c = 0; for (const w of W) if (norm(w.w) === word && ++c === n) return +w.T.toFixed(2); throw new Error("no word " + word + " #" + n); };
const SFX = []; const sfx = (t, f, g = 0.5) => { SFX.push([+(+t).toFixed(3), f, g]); return ""; };
reseed(29);

/* beats */
const A = { white: T("white"), every: T("every"), mixed: T("mixed") };
const B = { at: T("at"), noon: T("noon"), short: T("short"), blue: T("blue"), scat: T("scatters"), sky: T("sky") };
const C = { at: T("at", 2), sunset: T("sunset"), travels: T("travels"), more: T("more"), blue: T("blue", 3), away: T("away"), only: T("only"), oranges: T("oranges") };
const D = { so: T("so"), taking: T("taking"), long: T("long"), home: T("home") };

const IMG = (n) => `assets/img/${n}.png`;
const SPEC = ["#C8302B", "#E8742E", "#E9B43A", "#4E9A4A", "#2F7FC1", "#2343A8", "#6A3D9A"];
const dots = (p, n, cx, cy, spread, col) => Array.from({ length: n }, (_, i) => { const r = 9 + ((i * 37) % 17); return circle(`${p}${i}`, cx, cy, r, col); }).join("");
const dotTargets = (n, seed) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + seed, d = 260 + ((i * 53 + seed * 100) % 420); return [Math.round(Math.cos(a) * d), Math.round(Math.sin(a) * d * 1.25)]; });

const html = `<!doctype html>
<html lang="en" data-resolution="portrait"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
${RFONTS}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; background: ${RPAL.paper}; }
  ${RCSS}
  .scene { position: absolute; inset: 0; }
  .sheet { position: absolute; inset: 0; overflow: hidden; }
  #warm { position: absolute; inset: 0; background: #F08A3C; mix-blend-mode: multiply; opacity: 0; }
  svg.paths { position: absolute; left: 0; top: 0; }
</style></head><body>
${RDEFS}
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
  ${VOICE ? `<audio id="vo" class="clip" data-start="0" data-duration="${DUR}" data-track-index="5" src="voice.wav"></audio>` : ""}
  <div id="film" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" style="position:absolute; inset:0;">

    <!-- A: sunlight is every colour -->
    <div class="sheet" id="sA">${ground("gA", "#D6D2CB")}
      ${news("nA1", 30, 1480, 440, 280, -4)}${news("nA2", 720, 150, 330, 210, 7)}${grid("gdA", 650, 300, 340, 300)}
      ${circle("cA", 540, 660, 360, RPAL.red)}
      ${sticker("sun", IMG("sun"), 240, 360, 600)}${doodle("kA1", 820, 420, 64, "spark")}${doodle("kA2", 190, 330, 50, "bolt")}${doodle("kA3", 860, 860, 44, "spark", "#C8302B")}
      ${ransom("wWhite", "WHITE", 540, 1085, 128)}
      ${SPEC.map((c, i) => strip(`rb${i}`, 380, 1250 + i * 36, 720, 36, c, -14 + i * 3.2)).join("")}
      ${sticker("prism", IMG("prism"), 60, 1150, 340)}
    </div>

    <!-- B: at noon the blue scatters, blue sky -->
    <div class="sheet" id="sB">${ground("gB", "#C9D1DC")}
      ${news("nB1", 700, 1530, 380, 260, 5)}${grid("gdB", 70, 260, 300, 340)}
      <div class="rk-shape" id="skyB" style="left:0; top:0; width:1080px; height:1180px; background:#4C6FC2; clip-path:polygon(0 0,100% 0,100% 92%,88% 95%,74% 91%,60% 96%,44% 92%,30% 97%,14% 93%,0 96%);"></div>
      ${circle("cB", 540, 1160, 330, RPAL.blue)}
      ${sticker("sun2", IMG("sun"), 440, 230, 220)}
      ${sticker("watch", IMG("watch"), 760, 250, 230)}${doodle("kB1", 700, 220, 52, "bolt")}${doodle("kB2", 150, 760, 58, "spark", "#F3EEE4")}${doodle("kB3", 880, 720, 44, "spark")}
      <svg class="paths" width="1080" height="1920">${route("rB", "M550 460 L550 880")}</svg>
      ${dots("dB", 26, 540, 640, 0, RPAL.blue)}
      ${sticker("apollo", IMG("apollo"), 250, 860, 580)}
      ${sticker("sunflower", IMG("sunflower"), 790, 1250, 300)}
      ${ransom("wSky", "BLUE SKY", 540, 560, 104)}
    </div>

    <!-- C: at sunset the light travels through more air, only red and orange arrive -->
    <div class="sheet" id="sC">${ground("gC", "#D4CBC0")}
      ${news("nC1", 20, 160, 360, 240, -6)}${grid("gdC", 700, 1320, 320, 300)}
      ${half("hC", 540, 1150, 480, RPAL.yellow)}
      ${sticker("globe", IMG("globe"), 180, 500, 720)}
      ${sticker("sun3", IMG("sun"), 30, 1000, 290)}${doodle("kC1", 880, 600, 60, "spark")}${doodle("kC2", 170, 520, 48, "bolt", "#C8302B")}${doodle("kC3", 640, 1160, 44, "spark")}
      <svg class="paths" width="1080" height="1920">${route("rC", "M230 1200 C 200 420, 820 300, 990 760")}</svg>
      ${dots("dC", 18, 520, 560, 0, RPAL.blue)}
      ${strip("oC1", 160, 1230, 760, 40, RPAL.red, -3)}${strip("oC2", 160, 1282, 760, 40, "#E8742E", 2)}
      <div id="warm"></div>
      ${ransom("wSunset", "SUNSET", 540, 330, 120)}
      ${ransom("wOrange", "ORANGE", 540, 1380, 104)}
    </div>

    <!-- D: light taking the long way home -->
    <div class="sheet" id="sD">${ground("gD", "#E79A62")}
      ${news("nD1", 700, 180, 340, 220, 6)}
      ${half("hD", 540, 1190, 400, RPAL.yellow)}
      ${sticker("sun4", IMG("sun"), 390, 820, 300)}${doodle("kD1", 260, 720, 56, "spark", "#F3EEE4")}${doodle("kD2", 820, 760, 46, "spark")}${doodle("kD3", 180, 560, 50, "bolt")}
      ${sticker("wave", IMG("wave"), -40, 1060, 1160)}
      ${sticker("swallow", IMG("swallow"), 640, 500, 420)}
      ${ransom("wHome", "HOME", 540, 380, 150)}
    </div>
  </div>
</div>
<script>
  window.__timelines = window.__timelines || {};
  gsap.config({ force3D: true });
  const tl = gsap.timeline({ paused: true });
  ${HELPERS}
  ${RHELPERS}
  const dotsOut = (p, n, at, tg, fade) => { tg.forEach(([x, y], i) => { tl.fromTo("#" + p + i, { opacity: 0, x: 0, y: 0, scale: 0.3 }, { opacity: 1, x: x, y: y, scale: 1, duration: 0.6, ease: sm("power3.out", 0.6), immediateRender: false }, at + (i % 6) * 0.03);
    if (fade) tl.to("#" + p + i, { x: x * 2.6, y: y * 2.6 - 300, opacity: 0, duration: 0.7, ease: sm("power2.in", 0.7) }, fade + (i % 5) * 0.04); }); };
  const sheetUp = (sel, at, from) => tl.fromTo(sel, { yPercent: from || 100 }, { yPercent: 0, duration: 0.45, ease: sm("power3.inOut", 0.45), immediateRender: true }, at);
  const sheetX = (sel, at) => tl.fromTo(sel, { xPercent: 100 }, { xPercent: 0, duration: 0.45, ease: sm("power3.inOut", 0.45), immediateRender: true }, at);

  /* A */
  ["#nA1", "#nA2", "#gdA"].forEach((s, i) => tl.set(s, { opacity: 1 }, 0));
  shapeIn("#cA", 0.02, 0.5);${sfx(0.02, "paper-flick", 0.5)}
  enter("#sun", 0.12, { y: -900, rotation: -12 }, 0.55);${sfx(0.15, "paper-slide", 0.6)}
  tl.fromTo("#sun", { rotation: 0 }, { rotation: 8, duration: ${f2(B.at - 0.6)}, ease: "none", immediateRender: false }, 0.7);
  pop("#kA1", 0.5, -20); pop("#kA2", 0.7, 15); pop("#kA3", ${f2(A.every + 0.5)}, 10);
  ransomIn("#wWhite", ${f2(A.white - 0.05)}, 0.06);${sfx(A.white, "paper-tap", 0.7)}
  enter("#prism", ${f2(A.every - 0.25)}, { x: -500, rotation: 14 }, 0.45);${sfx(A.every - 0.2, "paper-slide", 0.5)}
  ${SPEC.map((_, i) => `tl.fromTo("#rb${i}", { opacity: 1, scaleX: 0, transformOrigin: "0% 50%" }, { opacity: 1, scaleX: 1, duration: 0.4, ease: sm("power3.out", 0.4), immediateRender: false }, ${f2(A.every + 0.1 + i * 0.07)});`).join(" ")}${sfx(A.every + 0.12, "marker", 0.4)}
  tl.to(["#rb0", "#rb2", "#rb4", "#rb6"], { y: -8, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${f2(A.mixed)});

  /* B */
  sheetUp("#sB", ${f2(B.at - 0.3)});${sfx(B.at - 0.3, "whoosh", 0.5)}
  ["#nB1", "#gdB"].forEach((s) => tl.set(s, { opacity: 1 }, ${f2(B.at - 0.3)}));
  shapeIn("#cB", ${f2(B.at - 0.05)}, 0.5);
  enter("#sun2", ${f2(B.at)}, { y: -500 }, 0.4);
  enter("#apollo", ${f2(B.at + 0.15)}, { y: 1000 }, 0.55);${sfx(B.at + 0.2, "paper-slide", 0.6)}
  pop("#kB1", ${f2(B.noon + 0.1)}, 15); pop("#kB2", ${f2(B.blue + 0.2)}, -15); pop("#kB3", ${f2(B.scat + 0.2)}, 10);
  pop("#watch", ${f2(B.noon - 0.05)}, 20);${sfx(B.noon, "paper-tap", 0.7)}
  tl.fromTo("#watch", { rotation: 0 }, { rotation: -10, duration: 1.2, ease: "none", immediateRender: false }, ${f2(B.noon + 0.25)});
  tl.set("#rB", { opacity: 1 }, 0); drawRoute("rB", ${f2(B.short - 0.1)}, 0.55);${sfx(B.short, "marker", 0.5)}
  dotsOut("dB", 26, ${f2(B.blue)}, ${JSON.stringify(dotTargets(26, 0.4))});${sfx(B.blue, "riser", 0.35)}
  enter("#sunflower", ${f2(B.scat + 0.3)}, { x: 500, rotation: 20 }, 0.45);
  tl.fromTo("#skyB", { opacity: 1, yPercent: -100 }, { opacity: 1, yPercent: 0, duration: 0.5, ease: sm("power3.inOut", 0.5), immediateRender: false }, ${f2(B.sky - 0.75)});${sfx(B.sky - 0.75, "paper-slide", 0.6)}
  ransomIn("#wSky", ${f2(B.sky - 0.3)}, 0.06);${sfx(B.sky - 0.25, "paper-tap", 0.7)}

  /* C */
  sheetX("#sC", ${f2(C.at - 0.3)});${sfx(C.at - 0.3, "whoosh", 0.5)}
  ["#nC1", "#gdC"].forEach((s) => tl.set(s, { opacity: 1 }, ${f2(C.at - 0.3)}));
  shapeIn("#hC", ${f2(C.at - 0.05)}, 0.5);
  enter("#globe", ${f2(C.at + 0.05)}, { y: 900, rotation: -8 }, 0.5);${sfx(C.at + 0.1, "paper-slide", 0.6)}
  pop("#kC1", ${f2(C.sunset + 0.3)}, -15); pop("#kC2", ${f2(C.travels + 0.2)}, 15); pop("#kC3", ${f2(C.only + 0.3)}, 10);
  ransomIn("#wSunset", ${f2(C.sunset - 0.05)}, 0.06);${sfx(C.sunset, "paper-tap", 0.7)}
  enter("#sun3", ${f2(C.travels - 0.4)}, { x: -500 }, 0.45);
  tl.set("#rC", { opacity: 1 }, 0); drawRoute("rC", ${f2(C.travels - 0.05)}, ${f2(C.more - C.travels + 0.5)});${sfx(C.travels, "marker", 0.5)}
  tl.fromTo("#globe", { rotation: 0 }, { rotation: 6, duration: ${f2(D.so - C.at)}, ease: "none", immediateRender: false }, ${f2(C.at + 0.6)});
  dotsOut("dC", 18, ${f2(C.blue - 0.15)}, ${JSON.stringify(dotTargets(18, 1.3))}, ${f2(C.away)});${sfx(C.blue, "riser", 0.35)}
  tl.fromTo("#warm", { opacity: 0 }, { opacity: 0.55, duration: 0.8, ease: "power1.inOut", immediateRender: false }, ${f2(C.only - 0.2)});
  enter("#oC1", ${f2(C.only + 0.2)}, { x: -1100 }, 0.45); enter("#oC2", ${f2(C.only + 0.35)}, { x: 1100 }, 0.45);${sfx(C.only + 0.2, "paper-slide", 0.5)}
  ransomIn("#wOrange", ${f2(C.oranges - 0.05)}, 0.06);${sfx(C.oranges, "paper-tap", 0.7)}

  /* D */
  sheetUp("#sD", ${f2(D.so - 0.3)});${sfx(D.so - 0.3, "whoosh", 0.5)}
  tl.set("#nD1", { opacity: 1 }, ${f2(D.so - 0.3)});
  shapeIn("#hD", ${f2(D.so - 0.05)}, 0.55);
  enter("#sun4", ${f2(D.so + 0.1)}, { y: 400 }, 0.5);
  tl.fromTo("#sun4", { y: 0 }, { y: 130, duration: ${f2(DUR - D.so - 0.6)}, ease: "sine.inOut", immediateRender: false }, ${f2(D.so + 0.6)});
  enter("#wave", ${f2(D.so + 0.2)}, { y: 700 }, 0.55);${sfx(D.so + 0.25, "paper-slide", 0.6)}
  tl.fromTo("#swallow", { opacity: 1, x: 500, y: 120, rotation: 6 }, { opacity: 1, x: -470, y: -40, rotation: -4, duration: ${f2(DUR - D.taking + 0.2)}, ease: sm("power1.inOut", ${f2(DUR - D.taking + 0.2)}), immediateRender: false }, ${f2(D.taking - 0.4)});${sfx(D.taking - 0.35, "whoosh", 0.4)}
  pop("#kD1", ${f2(D.so + 0.5)}, -15); pop("#kD2", ${f2(D.so + 0.7)}, 10); pop("#kD3", ${f2(D.long)}, 15);
  ransomIn("#wHome", ${f2(D.home - 0.1)}, 0.08);${sfx(D.home, "paper-tap", 0.8)}

  [["#sA", 0, ${f2(B.at)}], ["#sB", ${f2(B.at)}, ${f2(C.at)}], ["#sC", ${f2(C.at)}, ${f2(D.so)}], ["#sD", ${f2(D.so)}, ${DUR}]].forEach(([s, a, b]) => tl.fromTo(s, { scale: 1 }, { scale: 1.05, transformOrigin: "50% 47%", duration: b - a + 0.4, ease: "none", immediateRender: false }, a));
  boil(${DUR});
  window.__timelines["main"] = tl;
</script></body></html>`;
const neg = html.match(/\}, -[0-9.]+\)/g); if (neg) throw new Error("tween scheduled before 0s: " + neg.join(" "));
writeFileSync(new URL("./index.html", import.meta.url), html);
writeFileSync(new URL("./sfx.json", import.meta.url), JSON.stringify(SFX));
console.log("sunset", DUR, "s", JSON.stringify({ A, B, C, D }));
