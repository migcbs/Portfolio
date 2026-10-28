"use client";

import { useEffect, useRef } from "react";
import { BRAND_LOGO } from "@/lib/brand";

/**
 * Hero "video": the Jarana Studios logo spins in like a record and melts into
 * drips; where it drained, "web development" types itself out like a terminal,
 * then backspaces away while the logo pours back in from above. Loops forever.
 *
 * It's drawn on a canvas in vertical slices: each slice is stretched and
 * dropped by its own drip amount, and an SVG "goo" filter (blur + alpha
 * threshold) fuses the slices back into liquid blobs while things move.
 */

const TYPED = "web development";

// One loop, in ms.
const T = {
  logoIn: [0, 1500],
  logoMelt: [3300, 5900],
  typeStart: 5900,
  typeChar: 80,
  eraseStart: 9300,
  eraseChar: 30,
  cycle: 10200,
} as const;

type Range = readonly [number, number];
type Drips = Float32Array;

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const progress = (t: number, [a, b]: Range) => clamp((t - a) / (b - a));
const smooth = (a: number, b: number, v: number) => {
  const x = clamp((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
const easeOutBack = (x: number) => 1 + 2.4 * (x - 1) ** 3 + 1.4 * (x - 1) ** 2;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Per-column drip weights (0..1): a gentle wave plus a handful of sharp drips. */
function makeDrips(seed: number, count = 120): Drips {
  const rand = mulberry32(seed);
  const peaks = Array.from({ length: 8 }, () => ({
    c: rand(),
    w: 0.012 + rand() * 0.035,
    h: 0.45 + rand() * 0.55,
  }));
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;
  const out = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const u = i / (count - 1);
    let v = 0.16 + 0.1 * Math.sin(u * 9 + p1) + 0.06 * Math.sin(u * 23 + p2);
    for (const p of peaks) v += p.h * Math.exp(-(((u - p.c) / p.w) ** 2));
    out[i] = clamp(v);
  }
  return out;
}

function sample(drips: Drips, u: number) {
  const f = u * (drips.length - 1);
  const i = Math.floor(f);
  const j = Math.min(drips.length - 1, i + 1);
  return drips[i] + (drips[j] - drips[i]) * (f - i);
}

/**
 * Draws `src` into (x, y, w, h) as vertical slices.
 * - "down": melting; a 0 → 1 goes from intact to drained off the bottom.
 * - "in": pouring in from above; a 1 → 0 goes from streams to intact.
 */
function drawMelt(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource,
  sw: number,
  sh: number,
  x: number,
  y: number,
  w: number,
  h: number,
  a: number,
  mode: "down" | "in",
  drips: Drips
) {
  const n = Math.max(32, Math.round(w / 2.5));
  const dw = w / n;
  const sdw = sw / n;
  const split = 0.55; // top part sags gently, bottom part takes the drip
  for (let i = 0; i < n; i++) {
    const r = sample(drips, i / (n - 1));
    let top: number;
    let mid: number;
    let bottom: number;
    let alpha: number;
    if (mode === "down") {
      const ai = clamp((a - 0.3 * (1 - r)) / 0.7);
      if (ai >= 1) continue;
      const stretch = h * (0.12 + 1.5 * r) * ai * ai;
      const fall = h * 1.35 * ai ** 3;
      top = y + fall;
      mid = top + h * split + stretch * 0.2 - fall * 0.15;
      bottom = y + h + stretch + fall * 0.55;
      alpha = 1 - smooth(0.72, 1, ai);
    } else {
      const ai = clamp((a - 0.35 * r) / 0.65);
      if (ai >= 1) continue;
      const stretch = h * (0.25 + 1.9 * (1 - r)) * ai * ai;
      top = y - stretch;
      mid = y + h * split - stretch * 0.15;
      bottom = y + h + h * 0.08 * ai;
      alpha = 1 - smooth(0.7, 1, ai);
    }
    if (alpha <= 0.01 || bottom - top < 1) continue;
    mid = clamp(mid, top + 0.5, bottom - 0.5);
    ctx.globalAlpha = alpha;
    const sx = i * sdw;
    const dx = x + i * dw;
    ctx.drawImage(src, sx, 0, sdw, sh * split, dx, top, dw + 0.6, mid - top);
    ctx.drawImage(src, sx, sh * split, sdw, sh * (1 - split), dx, mid, dw + 0.6, bottom - mid);
  }
  ctx.globalAlpha = 1;
}

/** How many characters of TYPED are on screen at time `tc` within a loop. */
function typedCount(tc: number) {
  const n = TYPED.length;
  if (tc < T.typeStart) return 0;
  if (tc < T.eraseStart) return Math.min(n, Math.floor((tc - T.typeStart) / T.typeChar));
  return Math.max(0, n - Math.floor((tc - T.eraseStart) / T.eraseChar));
}

export function BrandIntro({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const line = lineRef.current;
    const text = textRef.current;
    if (!canvas || !line || !text) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const logo = new Image();
    logo.src = BRAND_LOGO;

    let raf = 0;
    let disposed = false;
    let start = 0;
    let gooOn = false;
    let layout = { w: 0, h: 0, dpr: 1, L: 0, lx: 0, ly: 0 };
    let shown = -1;
    const dripCache = new Map<string, Drips>();
    const drips = (key: string, seed: number) => {
      let d = dripCache.get(key);
      if (!d) {
        if (dripCache.size > 8) dripCache.clear();
        d = makeDrips(seed);
        dripCache.set(key, d);
      }
      return d;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const L = Math.min(w * 0.74, h * 0.52, 640);
      const cy = h * 0.43;
      layout = { w, h, dpr, L, lx: (w - L) / 2, ly: cy - L / 2 };
      // The typed line sits where the logo drained; with no motion it goes under the logo.
      line.style.top = `${reduced ? cy + L / 2 + 28 : cy}px`;
    };

    const setTyped = (count: number, tc: number) => {
      if (count !== shown) {
        shown = count;
        text.textContent = TYPED.slice(0, count);
      }
      const typing = tc < T.typeStart + TYPED.length * T.typeChar || tc >= T.eraseStart;
      line.dataset.typing = typing ? "true" : "false";
      line.style.opacity = tc >= T.typeStart - 500 && (count > 0 || tc < T.eraseStart) ? "1" : "0";
    };

    const setGoo = (on: boolean) => {
      if (on === gooOn) return;
      gooOn = on;
      canvas.style.filter = on ? "url(#jarana-goo)" : "none";
    };

    const drawLogoIntact = (scale = 1, rotation = 0, alpha = 1) => {
      const { L, lx, ly } = layout;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(lx + L / 2, ly + L / 2);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      ctx.drawImage(logo, -L / 2, -L / 2, L, L);
      ctx.restore();
    };

    const frame = (now: number) => {
      if (disposed) return;
      if (!start) start = now;
      const t = now - start;
      const k = Math.floor(t / T.cycle);
      const tc = t - k * T.cycle;
      const { dpr, L, lx, ly } = layout;
      const iw = logo.naturalWidth;
      const ih = logo.naturalHeight;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, layout.w, layout.h);
      let moving = false;

      // Logo
      const melt = progress(tc, T.logoMelt);
      if (k === 0 && tc < T.logoIn[1]) {
        const p = progress(tc, T.logoIn);
        drawLogoIntact(0.35 + 0.65 * easeOutBack(p), -(1 - easeOutCubic(p)) * Math.PI * 3, clamp(p * 3));
      } else if (melt > 0) {
        if (melt < 1) {
          moving = true;
          drawMelt(ctx, logo, iw, ih, lx, ly, L, L, melt, "down", drips(`lm${k}`, k * 7 + 1));
        }
      } else {
        const pour = 1 - progress(tc, T.logoIn);
        if (pour > 0) {
          moving = true;
          drawMelt(ctx, logo, iw, ih, lx, ly, L, L, pour, "in", drips(`li${k}`, k * 7 + 2));
        } else {
          const hold = progress(tc, [T.logoIn[1], T.logoMelt[0]]);
          drawLogoIntact(1 + 0.025 * Math.sin(Math.PI * hold));
        }
      }

      setTyped(typedCount(tc), tc);
      setGoo(moving);
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      resize();
      if (reduced) drawStill();
    };

    const drawStill = () => {
      ctx.setTransform(layout.dpr, 0, 0, layout.dpr, 0, 0);
      ctx.clearRect(0, 0, layout.w, layout.h);
      drawLogoIntact();
      text.textContent = TYPED;
      line.style.opacity = "1";
    };

    const begin = async () => {
      try {
        await logo.decode();
      } catch {
        // Fall back to whatever has loaded; the animation still runs.
      }
      if (disposed) return;
      resize();
      window.addEventListener("resize", onResize);
      if (reduced) drawStill();
      else raf = requestAnimationFrame(frame);
    };
    begin();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id="jarana-goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      <canvas ref={ref} className={className} aria-hidden="true" />
      <div
        ref={lineRef}
        aria-hidden="true"
        data-typing="true"
        className="terminal-line fixed inset-x-0 z-[2] -translate-y-1/2 px-4 text-center font-mono text-xl sm:text-3xl md:text-4xl text-white pointer-events-none opacity-0 transition-opacity duration-300"
      >
        <span className="text-gray-500">&gt; </span>
        <span ref={textRef} />
        <span className="terminal-cursor" />
      </div>
    </>
  );
}
