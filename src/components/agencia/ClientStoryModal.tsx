"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, Play } from "lucide-react";

type Story = { id: string; category: "PHOTO" | "VIDEO" | "MERCH"; type: "IMAGE" | "VIDEO"; mediaUrl: string };

const IMAGE_DURATION_MS = 5000;
const MAX_VIDEO_DURATION_MS = 15000;

const CATEGORY_LABEL: Record<Story["category"], string> = {
  PHOTO: "Fotos",
  VIDEO: "Videos",
  MERCH: "Merch",
};
const CATEGORY_ORDER: Story["category"][] = ["PHOTO", "VIDEO", "MERCH"];

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
  const [viewer, setViewer] = useState<{ category: Story["category"]; startIndex: number } | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (viewer) {
    const categoryStories = stories.filter((story) => story.category === viewer.category);
    return (
      <StoryViewer
        clientName={clientName}
        categoryLabel={CATEGORY_LABEL[viewer.category]}
        stories={categoryStories}
        startIndex={viewer.startIndex}
        onBack={() => setViewer(null)}
        onClose={onClose}
      />
    );
  }

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: stories.filter((story) => story.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg md:max-w-2xl liquid-glass rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6 gap-4">
          <h3 className="text-xl font-medium">{clientName}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {description && <p className="text-sm text-gray-400 mb-6">{description}</p>}

        {groups.length > 0 ? (
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.category}>
                <h4 className="text-sm font-medium text-gray-400 mb-3">{CATEGORY_LABEL[group.category]}</h4>
                <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                  {group.items.map((story, i) => (
                    <button
                      key={story.id}
                      onClick={() => setViewer({ category: group.category, startIndex: i })}
                      className="relative aspect-square rounded-md overflow-hidden bg-white/5 group"
                    >
                      {story.type === "VIDEO" ? (
                        <>
                          <video src={story.mediaUrl} className="w-full h-full object-cover" muted preload="metadata" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                            <Play size={20} className="fill-white" />
                          </div>
                        </>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={story.mediaUrl}
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
        ) : (
          <p className="text-sm text-gray-500">Aún no hay fotos, videos o merch publicados.</p>
        )}
      </div>
    </div>
  );
}

function StoryViewer({
  clientName,
  categoryLabel,
  stories,
  startIndex,
  onBack,
  onClose,
}: {
  clientName: string;
  categoryLabel: string;
  stories: Story[];
  startIndex: number;
  onBack: () => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = stories[index];

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
    if (index + 1 >= stories.length) {
      onBack();
      return;
    }
    setIndex((i) => i + 1);
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm sm:max-w-md h-[85vh] sm:h-[80vh] rounded-2xl overflow-hidden bg-gray-950">
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
          <button
            onClick={onBack}
            className="liquid-glass h-8 pl-2 pr-3 rounded-full flex items-center gap-1 text-xs"
          >
            <ChevronLeft size={14} /> {clientName} · {categoryLabel}
          </button>
          <button onClick={onClose} aria-label="Cerrar" className="liquid-glass w-8 h-8 rounded-full flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <button aria-label="Anterior" onClick={goPrev} className="absolute left-0 top-0 bottom-0 w-1/3 z-10" />
        <button aria-label="Siguiente" onClick={goNext} className="absolute right-0 top-0 bottom-0 w-1/3 z-10" />

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
      </div>
    </div>
  );
}
