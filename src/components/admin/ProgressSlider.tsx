"use client";

import { useRef, useState, useTransition } from "react";
import { updateProjectProgress } from "@/app/admin/portfolio/actions";

export function ProgressSlider({ projectId, initialValue }: { projectId: string; initialValue: number }) {
  const [value, setValue] = useState(initialValue);
  const [dragging, setDragging] = useState(false);
  const [, startTransition] = useTransition();
  const trackRef = useRef<HTMLDivElement>(null);

  function valueFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  }

  function commit(next: number) {
    setValue(next);
    startTransition(() => {
      updateProjectProgress(projectId, next);
    });
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setValue(valueFromClientX(e.clientX));
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setValue(valueFromClientX(e.clientX));
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging(false);
    commit(valueFromClientX(e.clientX));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      commit(Math.min(100, value + 5));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      commit(Math.max(0, value - 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      commit(0);
    } else if (e.key === "End") {
      e.preventDefault();
      commit(100);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-gray-400">Avance</label>
        <span className="label-mono text-gray-300">{value}%</span>
      </div>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Avance del proyecto"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative h-8 rounded-full bg-white/5 border border-white/10 cursor-pointer select-none touch-none focus:outline-none focus:border-white/40"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white/80"
          style={{ width: `${value}%`, transition: dragging ? "none" : "width 150ms ease-out" }}
        />
        <div
          className="absolute top-1/2 h-5 w-5 rounded-full bg-white shadow-lg -translate-y-1/2 -translate-x-1/2 border-2 border-black/40"
          style={{ left: `${value}%`, transition: dragging ? "none" : "left 150ms ease-out" }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5">Arrastra, haz clic en la barra o usa las flechas del teclado.</p>
    </div>
  );
}
