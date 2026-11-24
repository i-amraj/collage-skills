#!/usr/bin/env node
/**
 * Cut a subject off a plain background (white studio shot, a generated image, a scan), no dependencies, just ffmpeg.
 * Pixels close to the corner colour AND connected to the image edge become transparent, so a white marble
 * dome stays solid while the white sky around it goes. Soft 1px edge, cropped to the subject.
 *
 *   node cutout.mjs in.jpg out.png [--tol 18]      tol: how far from the background colour still counts as background
 *
 * Photos with a real sky or a busy background: use lift (macOS) or `npx -y hyperframes@0.8.33 remove-background` instead.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [src, dst, ...rest] = process.argv.slice(2);
if (!src || !dst) { console.error("usage: node cutout.mjs in.jpg out.png [--tol 18]"); process.exit(1); }
const ti = rest.indexOf("--tol"); const TOL = ti === -1 ? 18 : +rest[ti + 1];

const [w, h] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src]).toString().trim().split(",").map(Number);
const px = execFileSync("ffmpeg", ["-v", "error", "-i", src, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgba", "-"], { maxBuffer: w * h * 4 + 1024 });

// background colour = average of the four 6x6 corners
let br = 0, bg = 0, bb = 0, n = 0;
for (const [cx, cy] of [[0, 0], [w - 6, 0], [0, h - 6], [w - 6, h - 6]]) for (let y = cy; y < cy + 6; y++) for (let x = cx; x < cx + 6; x++) { const i = (y * w + x) * 4; br += px[i]; bg += px[i + 1]; bb += px[i + 2]; n++; }
br /= n; bg /= n; bb /= n;
const near = (p) => { const i = p * 4; return Math.max(Math.abs(px[i] - br), Math.abs(px[i + 1] - bg), Math.abs(px[i + 2] - bb)) < TOL; };

// flood fill from every edge pixel
const out = new Uint8Array(w * h);            // 1 = background
const q = new Int32Array(w * h); let qh = 0, qt = 0;
const push = (p) => { if (!out[p] && near(p)) { out[p] = 1; q[qt++] = p; } };
for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
while (qh < qt) { const p = q[qh++], x = p % w, y = (p / w) | 0;
  if (x > 0) push(p - 1); if (x < w - 1) push(p + 1); if (y > 0) push(p - w); if (y < h - 1) push(p + w); }

// alpha with a soft edge (two 3x3 box passes), then crop to the subject
let a = new Float32Array(w * h); for (let p = 0; p < w * h; p++) a[p] = out[p] ? 0 : 255;
for (let pass = 0; pass < 2; pass++) { const b = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, c = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < w && yy < h) { s += a[yy * w + xx]; c++; } }
    b[y * w + x] = s / c; }
  a = b; }
let x0 = w, y0 = h, x1 = 0, y1 = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (a[y * w + x] > 128) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
if (x1 <= x0) { console.error("nothing left after the cut: is the background really plain? try a lower --tol"); process.exit(1); }
x0 = Math.max(0, x0 - 4); y0 = Math.max(0, y0 - 4); x1 = Math.min(w - 1, x1 + 4); y1 = Math.min(h - 1, y1 + 4);
const cw = x1 - x0 + 1, ch = y1 - y0 + 1, res = Buffer.alloc(cw * ch * 4);
for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const s = ((y + y0) * w + (x + x0)) * 4, d = (y * cw + x) * 4;
  res[d] = px[s]; res[d + 1] = px[s + 1]; res[d + 2] = px[s + 2]; res[d + 3] = Math.round(a[(y + y0) * w + (x + x0)]); }
const raw = join(tmpdir(), `cutout-${process.pid}.rgba`); writeFileSync(raw, res);
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${cw}x${ch}`, "-i", raw, "-frames:v", "1", dst]); unlinkSync(raw);
console.log(`${dst}  ${cw}x${ch}  (background ${[br, bg, bb].map(v => Math.round(v)).join(",")}, tol ${TOL})`);
