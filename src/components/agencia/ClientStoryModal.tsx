"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type Story = { id: string; type: "IMAGE" | "VIDEO"; mediaUrl: string };

const IMAGE_DURATION_MS = 5000;
const MAX_VIDEO_DURATION_MS = 15000;

export function ClientStoryModal({
  clientName,
  description,
  stories,
  onClose,
}: {
  clientName: string;
  description: string | null;
  stories: Story[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = stories[index];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!current) return;
    const duration = current.type === "VIDEO" ? MAX_VIDEO_DURATION_MS : IMAGE_DURATION_MS;
    timeoutRef.current = setTimeout(() => goNext(), duration);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function goNext() {
    setIndex((i) => (i + 1 < stories.length ? i + 1 : i));
    if (index + 1 >= stories.length) onClose();
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  // No stories: show a simple project-details panel instead of the story viewer.
  if (!current) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md liquid-glass rounded-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{clientName}</h3>
            <button onClick={onClose} aria-label="Cerrar" className="liquid-glass w-8 h-8 rounded-full flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-400">
            {description || "Aún no hay detalles publicados sobre este proyecto."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm h-[80vh] rounded-2xl overflow-hidden bg-gray-950">
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
          {stories.map((story, i) => (
            <div key={story.id} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
              <div
                className={`h-full bg-white ${i < index ? "w-full" : i > index ? "w-0" : ""}`}
                style={
                  i === index
                    ? {
                        animation: `story-progress ${
                          current.type === "VIDEO" ? MAX_VIDEO_DURATION_MS : IMAGE_DURATION_MS
                        }ms linear forwards`,
                      }
                    : undefined
                }
              />
            </div>
          ))}
        </div>

        <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
          <span className="text-sm font-medium">{clientName}</span>
          <button onClick={onClose} aria-label="Cerrar" className="liquid-glass w-8 h-8 rounded-full flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <button
          aria-label="Anterior"
          onClick={goPrev}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
        />
        <button
          aria-label="Siguiente"
          onClick={goNext}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
        />

        {current.type === "VIDEO" ? (
          <video
            key={current.id}
            src={current.mediaUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={goNext}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={current.id} src={current.mediaUrl} alt="" className="w-full h-full object-cover" />
        )}

        {description && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4 pt-10">
            <p className="text-xs text-gray-300">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
