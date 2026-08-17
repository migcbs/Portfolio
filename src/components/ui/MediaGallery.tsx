"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, Play } from "lucide-react";

export type GalleryItem = { id: string; category: "PHOTO" | "VIDEO" | "MERCH"; type: "IMAGE" | "VIDEO"; mediaUrl: string };

const IMAGE_DURATION_MS = 5000;
const MAX_VIDEO_DURATION_MS = 15000;

const CATEGORY_LABEL: Record<GalleryItem["category"], string> = {
  PHOTO: "Fotos",
  VIDEO: "Videos",
  MERCH: "Merch",
};
const CATEGORY_ORDER: GalleryItem["category"][] = ["PHOTO", "VIDEO", "MERCH"];

/**
 * An Instagram-feed-style thumbnail grid, grouped by category, that opens a
 * full-screen tap-to-advance viewer on click. The viewer portals to
 * document.body — any `.liquid-glass` ancestor (this is meant to be
 * embedded inside a modal) sets `backdrop-filter`, which — like
 * `transform` — creates a new containing block for `position: fixed`
 * descendants, trapping the viewer inside the modal's box instead of the
 * full viewport. Portaling escapes that entirely.
 */
export function MediaGallery({ title, items }: { title: string; items: GalleryItem[] }) {
  const [viewer, setViewer] = useState<{ category: GalleryItem["category"]; startIndex: number } | null>(null);

  if (viewer) {
    const categoryItems = items.filter((item) => item.category === viewer.category);
    return (
      <MediaViewer
        title={title}
        categoryLabel={CATEGORY_LABEL[viewer.category]}
        items={categoryItems}
        startIndex={viewer.startIndex}
        onBack={() => setViewer(null)}
      />
    );
  }

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  if (groups.length === 0) {
    return <p className="text-sm text-gray-500">Aún no hay fotos, videos o merch publicados.</p>;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.category}>
          <h4 className="label-mono text-gray-400 mb-3">{CATEGORY_LABEL[group.category]}</h4>
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
            {group.items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setViewer({ category: group.category, startIndex: i })}
                className="relative aspect-square rounded-md overflow-hidden bg-white/5 group"
              >
                {item.type === "VIDEO" ? (
                  <>
                    <video src={item.mediaUrl} className="w-full h-full object-cover" muted preload="metadata" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                      <Play size={20} className="fill-white" />
                    </div>
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.mediaUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MediaViewer({
  title,
  categoryLabel,
  items,
  startIndex,
  onBack,
}: {
  title: string;
  categoryLabel: string;
  items: GalleryItem[];
  startIndex: number;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = items[index];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "Escape") onBack();
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
    if (index + 1 >= items.length) {
      onBack();
      return;
    }
    setIndex((i) => i + 1);
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  if (!current || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onBack}
    >
      <div
        className="relative inline-block max-w-[92vw] max-h-[88vh] rounded-2xl overflow-hidden bg-gray-950 leading-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
          {items.map((item, i) => (
            <div key={item.id} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
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
          <button
            onClick={onBack}
            className="label-mono liquid-glass h-8 pl-2 pr-3 rounded-full flex items-center gap-1"
          >
            <ChevronLeft size={14} /> {title} · {categoryLabel}
          </button>
          <button onClick={onBack} aria-label="Cerrar galería" className="liquid-glass w-8 h-8 rounded-full flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <button aria-label="Anterior" onClick={goPrev} className="absolute left-0 top-0 bottom-0 w-1/3 z-10" />
        <button aria-label="Siguiente" onClick={goNext} className="absolute right-0 top-0 bottom-0 w-1/3 z-10" />

        {current.type === "VIDEO" ? (
          <video
            key={current.id}
            src={current.mediaUrl}
            className="block max-w-[92vw] max-h-[88vh] w-auto h-auto"
            autoPlay
            muted
            playsInline
            onEnded={goNext}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.id}
            src={current.mediaUrl}
            alt=""
            className="block max-w-[92vw] max-h-[88vh] w-auto h-auto"
          />
        )}
      </div>
    </div>,
    document.body
  );
}
