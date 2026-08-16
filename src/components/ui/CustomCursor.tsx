"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function handleMove(e: MouseEvent) {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [role='button'], input, textarea, select")));
    }

    document.body.classList.add("custom-cursor-active");
    document.addEventListener("mousemove", handleMove);
    return () => {
      document.body.classList.remove("custom-cursor-active");
      document.removeEventListener("mousemove", handleMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 z-[200] rounded-full bg-red-500 pointer-events-none transition-[width,height] duration-150 ease-out ${
        hovering ? "w-6 h-6" : "w-2.5 h-2.5"
      }`}
      style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
    />
  );
}
