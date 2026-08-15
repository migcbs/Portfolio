"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, Image as ImageIcon, Video as VideoIcon, ShoppingBag } from "lucide-react";

type Story = { id: string; category: "PHOTO" | "VIDEO" | "MERCH"; type: "IMAGE" | "VIDEO"; mediaUrl: string };

const IMAGE_DURATION_MS = 5000;
const MAX_VIDEO_DURATION_MS = 15000;

const FOLDERS: { key: Story["category"]; label: string; icon: typeof ImageIcon }[] = [
  { key: "PHOTO", label: "Fotos", icon: ImageIcon },
  { key: "VIDEO", label: "Videos", icon: VideoIcon },
  { key: "MERCH", label: "Merch", icon: ShoppingBag },
];

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
  const [category, setCategory] = useState<Story["category"] | null>(null);

  const foldersWithContent = FOLDERS.filter((folder) =>
    stories.some((story) => story.category === folder.key)
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (category) {
    const categoryStories = stories.filter((story) => story.category === category);
    return (
      <StoryViewer
        clientName={clientName}
        stories={categoryStories}
        onBack={() => setCategory(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg md:max-w-2xl liquid-glass rounded-2xl p-6 sm:p-8 bg-gray-950 max-h-[85vh] overflow-y-auto"
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

        {foldersWithContent.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {foldersWithContent.map((folder) => {
              const count = stories.filter((s) => s.category === folder.key).length;
              const Icon = folder.icon;
              return (
                <button
                  key={folder.key}
                  onClick={() => setCategory(folder.key)}
                  className="liquid-glass rounded-xl p-4 sm:p-5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors"
                >
                  <Icon size={24} />
                  <span className="text-sm font-medium">{folder.label}</span>
                  <span className="text-xs text-gray-500">{count}</span>
                </button>
              );
            })}
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
  stories,
  onBack,
  onClose,
}: {
  clientName: string;
  stories: Story[];
  onBack: () => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = stories[index];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
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
            <ChevronLeft size={14} /> {clientName}
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
