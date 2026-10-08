// Dev-only contrast scanner: flags text/background class combos that fail
// WCAG contrast in light mode, dark mode (palette inverted), or both.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";
const LIGHT = {
  ink: { 50: "#f5f7fb", 100: "#e8edf6", 200: "#cbd6e8", 300: "#a7b6ce", 400: "#7d8dab", 500: "#586b8b", 600: "#3b4a66", 700: "#24334f", 800: "#16213a", 900: "#0b1020" },
  mint: { 50: "#effcf8", 100: "#d9f7ed", 200: "#b1eedb", 300: "#6ee7c7", 400: "#34d3aa", 500: "#12b98c", 600: "#0d9370", 700: "#08785e", 800: "#075f4b", 900: "#064b3d" },
  royal: { 50: "#f0f5ff", 100: "#dce8ff", 200: "#bfd4ff", 300: "#92b7ff", 400: "#6aa8ff", 500: "#3d7dfb", 600: "#2b5fd9", 700: "#214fbd", 800: "#1d429a", 900: "#173675" },
};
// dark = tokens overridden in globals.css (:root[data-theme="dark"]); missing keys keep light value
const DARK_OVERRIDES = {
  ink: { 50: "#1a1f2e", 100: "#232839", 200: "#8892ab", 400: "#8892ab", 500: "#9aa8c4", 600: "#c5cde0", 700: "#dbe3f2", 800: "#e8edf6", 900: "#f5f7fb" },
  mint: { 50: "#122b25", 100: "#17382f", 200: "#205748", 300: "#9cf2d8", 400: "#69e5c1", 500: "#31d0a6", 600: "#55e2bd", 700: "#8af1d3", 800: "#b8f7e5", 900: "#dafcf1" },
  royal: { 50: "#151f35", 100: "#1a2a47", 200: "#233c63", 300: "#5c91e5", 400: "#8ab7ff", 500: "#6aa8ff", 600: "#90baff", 700: "#b0ceff", 800: "#cee0ff", 900: "#e5efff" },
};
// globals.css dark-mode utility pins: fixed values applied in dark mode
const DARK_PINS = {
  white: "#161b27",
  "ink-900": "#0b1020",
  "grad:ink-900": "#0b1020",
  "grad:ink-800": "#16213a",
};
const FIXED = {
  white: "#ffffff", black: "#000000",
  "sky-50": "#f0f9ff", "sky-900": "#0c4a6e",
  "amber-50": "#fffbeb", "amber-800": "#92400e",
  "rose-50": "#fff1f2", "rose-900": "#881337",
  "green-600": "#16a34a", "green-700": "#15803d",
  "blue-600": "#2563eb", "blue-700": "#1d4ed8", "blue-800": "#1e40af",
  "orange-600": "#ea580c", "orange-700": "#c2410c",
};
const DARK_SURFACE = { panel: "#161b27", glass: "rgba(22,27,39,0.85)", body: "#0d1117", hero: "#0b1020" };

function hexToRgb(h) {
  h = h.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function luminance(h) {
  const [r, g, b] = hexToRgb(h).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function resolve(token, mode) {
  // token like "ink-600", "mint-500", "white", "sky-50"
  if (token === "white") return FIXED.white;
  if (token === "black") return FIXED.black;
  if (FIXED[token]) return FIXED[token];
  const [fam, shade] = token.split("-");
  if (LIGHT[fam] && LIGHT[fam][shade]) {
    const dark = DARK_OVERRIDES[fam] && DARK_OVERRIDES[fam][shade];
    return mode === "dark" && dark ? dark : LIGHT[fam][shade];
  }
  return null;
}

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith(".tsx")) yield p;
  }
}

const findings = [];
for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  // capture className contents (double-quoted, single-quoted, template literals w/o ${})
  const re = /className=(?:"([^"]*)"|'([^']*)'|`([^`*$]*)`)/g;
  let m;
  while ((m = re.exec(src))) {
    const cls = m[1] ?? m[2] ?? m[3];
    const lineNo = src.slice(0, m.index).split("\n").length;
    const tokens = cls.split(/\s+/);
    // text color
    let textTok = null;
    for (const t of tokens) {
      const mm = t.match(/^text-(ink|mint|royal)-(50|100|200|300|400|500|600|700|800|900)$/);
      if (mm) { textTok = `${mm[1]}-${mm[2]}`; continue; }
      if (t === "text-white") textTok = "white";
      if (t === "text-black") textTok = "black";
      const arb = t.match(/^text-\[(#[0-9a-fA-F]{6})\](?:\/(\d+))?$/);
      if (arb) textTok = arb[1];
      const fx = t.match(/^text-(sky-50|sky-900|amber-50|amber-800|rose-50|rose-900|green-600|green-700|blue-600|blue-700|blue-800|orange-600|orange-700)$/);
      if (fx) textTok = fx[1];
    }
    // background color (solid only; translucent handled separately)
    let bgTok = null, bgAlpha = 1;
    for (const t of tokens) {
      const mm = t.match(/^bg-(ink|mint|royal)-(50|100|200|300|400|500|600|700|800|900)$/);
      if (mm) { bgTok = `${mm[1]}-${mm[2]}`; continue; }
      const wm = t.match(/^bg-white(?:\/(\d+))?$/);
      if (wm) { bgTok = "white"; bgAlpha = wm[1] ? parseInt(wm[1], 10) / 100 : 1; continue; }
      const fx = t.match(/^bg-(sky-50|sky-900|amber-50|amber-800|rose-50|rose-900|green-600|green-700|blue-600|blue-700|blue-800|orange-600|orange-700)$/);
      if (fx) bgTok = fx[1];
      if (t === "panel") { bgTok = "__panel__"; }
      if (t === "glass-card") { bgTok = "__glass__"; }
      if (t === "hero-aurora") { bgTok = "__hero__"; }
      const gm = t.match(/^from-(ink|mint|royal)-(\d+00)$/);
      if (gm) bgTok = `grad:${gm[1]}-${gm[2]}`;
    }
    if (!textTok || !bgTok) continue;
    if (bgTok.startsWith("grad:")) {
      const [, fam, shade] = bgTok.match(/^grad:(ink|mint|royal)-(\d+00)$/);
      for (const mode of ["light", "dark"]) {
        const c = (mode === "dark" && DARK_PINS[bgTok]) || resolve(`${fam}-${shade}`, mode);
        if (!c) continue;
        const ratio = contrast(resolve(textTok, mode) ?? "#000", c);
        if (ratio < 4.5) findings.push({ file, lineNo, mode, ratio, textTok, bgTok, cls: cls.slice(0, 120) });
      }
      continue;
    }
    const bgBase = bgTok.startsWith("__") ? DARK_SURFACE[bgTok.slice(2, -2)] : null;
    for (const mode of ["light", "dark"]) {
      let bg = bgBase ? (mode === "dark" ? bgBase : (bgTok === "__panel__" ? "#ffffff" : bgTok === "__glass__" ? "rgba(255,255,255,0.82)" : "#0b1020")) : resolve(bgTok, mode);
      if (!bg) continue;
      if (bg.startsWith("rgba")) {
        // composite over body bg
        const bodyBg = mode === "dark" ? "#0d1117" : "#f7f9fd";
        const a = parseFloat(bg.match(/[\d.]+\)$/)[0]) || 0.85;
        const [r, g, b] = hexToRgb("#ffffff");
        const [br, bg2, bb] = hexToRgb(bodyBg);
        bg = "#" + [r * a + br * (1 - a), g * a + bg2 * (1 - a), b * a + bb * (1 - a)].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
      }
      if (bgAlpha < 1 && bgTok === "white") {
        // dark mode pins bg-white/70,/80,/95 to translucent dark surfaces;
        // /5,/10,/15 stay white (used on dark heroes)
        const baseHex = mode === "dark" && bgAlpha >= 0.7 ? "#161b27" : "#ffffff";
        const bodyBg = mode === "dark" ? "#0d1117" : "#f7f9fd";
        const [r, g, b] = hexToRgb(baseHex);
        const [br, bg2, bb] = hexToRgb(bodyBg);
        bg = "#" + [r * bgAlpha + br * (1 - bgAlpha), g * bgAlpha + bg2 * (1 - bgAlpha), b * bgAlpha + bb * (1 - bgAlpha)].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
      }
      if (mode === "dark" && DARK_PINS[bgTok]) bg = DARK_PINS[bgTok];
      const fg = resolve(textTok, mode);
      if (!fg) continue;
      const ratio = contrast(fg, bg);
      if (ratio < 4.5) findings.push({ file, lineNo, mode, ratio: ratio.toFixed(2), textTok, bgTok, cls: cls.slice(0, 140) });
    }
  }
}

findings.sort((a, b) => a.ratio - b.ratio);
for (const f of findings) {
  console.log(`${f.ratio.toString().padStart(5)}  ${f.mode.padEnd(5)}  ${f.file}:${f.lineNo}  text-${f.textTok} on ${f.bgTok}`);
  console.log(`        ${f.cls}`);
}
console.log(`\n${findings.length} findings`);
