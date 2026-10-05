"use client";

import { useEffect, useRef } from "react";

/**
 * Looping, muted hero background video that keeps itself playing.
 *
 * iOS can refuse `autoplay` (Low Power Mode, or React setting `muted` only as a
 * property after the autoplay check), leaving a dead play icon behind the hero
 * overlays. So we force muted + play() on mount, retry on the first touch/scroll
 * anywhere, and resume when the tab becomes visible again.
 */
export function HeroVideo({
  src,
  mobileSrc,
  className,
}: {
  src: string;
  mobileSrc?: string | null;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const tryPlay = () => {
      if (video.paused) video.play().catch(() => {});
    };
    const events = ["touchstart", "pointerdown", "scroll", "keydown"] as const;
    const onInteract = () => {
      tryPlay();
      if (!video.paused) events.forEach((e) => window.removeEventListener(e, onInteract));
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      video.removeEventListener("canplay", tryPlay);
      events.forEach((e) => window.removeEventListener(e, onInteract));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={`hero-video ${className ?? ""}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      aria-hidden="true"
    >
      {mobileSrc && <source src={mobileSrc} media="(orientation: portrait)" />}
      <source src={src} />
    </video>
  );
}
