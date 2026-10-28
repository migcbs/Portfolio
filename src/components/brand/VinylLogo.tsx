"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { BRAND_LOGO_SMALL, BRAND_NAME } from "@/lib/brand";

const SPIN_MS = 4200;
const BRAKE_MS = 650;

/**
 * Navbar logo that spins like a record on a turntable. On hover/focus it
 * brakes to a stop (instead of freezing mid-frame) and spins back up on leave.
 */
export function VinylLogo() {
  const discRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<Animation | null>(null);
  const rampRef = useRef(0);

  useEffect(() => {
    const disc = discRef.current;
    if (!disc || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animRef.current = disc.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
      duration: SPIN_MS,
      iterations: Infinity,
    });
    return () => {
      cancelAnimationFrame(rampRef.current);
      animRef.current?.cancel();
    };
  }, []);

  const rampTo = (target: number) => {
    const anim = animRef.current;
    if (!anim) return;
    cancelAnimationFrame(rampRef.current);
    const from = anim.playbackRate;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / BRAKE_MS);
      const eased = 1 - (1 - p) ** 3;
      const rate = from + (target - from) * eased;
      anim.playbackRate = rate;
      if (p < 1) rampRef.current = requestAnimationFrame(step);
      else if (target === 0) anim.pause();
    };
    if (target > 0 && anim.playState === "paused") {
      anim.playbackRate = 0.0001;
      anim.play();
    }
    rampRef.current = requestAnimationFrame(step);
  };

  return (
    <Link
      href="/"
      aria-label={`${BRAND_NAME} — inicio`}
      className="group relative block w-12 h-12 md:w-14 md:h-14 rounded-full animate-blur-fade-up"
      onPointerEnter={() => rampTo(0)}
      onPointerLeave={() => rampTo(1)}
      onFocus={() => rampTo(0)}
      onBlur={() => rampTo(1)}
    >
      {/* Record body: grooves peek out around the logo label */}
      <span
        aria-hidden="true"
        className="absolute -inset-1 rounded-full bg-[#050505] shadow-[0_6px_24px_rgba(0,0,0,0.7)]"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at center, rgba(255,255,255,0.07) 0 1px, transparent 1px 3px)",
        }}
      />
      <span ref={discRef} className="absolute inset-0 block will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND_LOGO_SMALL}
          alt=""
          width={56}
          height={56}
          className="w-full h-full select-none"
          draggable={false}
        />
      </span>
      {/* Static light sheen, like a lamp reflecting on vinyl while it turns */}
      <span
        aria-hidden="true"
        className="absolute -inset-1 rounded-full pointer-events-none opacity-60 transition-opacity duration-300 group-hover:opacity-90"
        style={{
          background:
            "conic-gradient(from 210deg, transparent 0deg, rgba(255,255,255,0.18) 25deg, transparent 60deg, transparent 180deg, rgba(255,255,255,0.12) 205deg, transparent 240deg)",
          mixBlendMode: "screen",
        }}
      />
    </Link>
  );
}
