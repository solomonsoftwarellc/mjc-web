"use client";

import { useEffect, useRef } from "react";
import { fullVariant, type GalleryEntry } from "~/app/wedding/gallery-types";

const SWIPE_PX = 50;

const formatMoment = (timestamp: string) =>
  new Date(timestamp).toLocaleString(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  });

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryEntry[];
  index: number;
  onClose: () => void;
  onNavigate: (delta: -1 | 1) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const item = items[index];

  // Keyboard navigation and background scroll lock while the viewer is open.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") onNavigate(-1);
      else if (event.key === "ArrowRight") onNavigate(1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onNavigate]);

  if (!item) return null;

  const label = "text-[11px] font-semibold uppercase tracking-[0.28em]";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.type === "video" ? "Video" : "Photo"}
      className="fixed inset-0 z-50 flex flex-col bg-[#11150f] text-[#f4efe6]"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start === null || end === undefined) return;
        if (Math.abs(end - start) > SWIPE_PX) onNavigate(end < start ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
        <button type="button" onClick={onClose} className={`${label} py-2`}>
          Close
        </button>
        <span className={`${label} tabular-nums opacity-70`}>
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.id}
            src={fullVariant(item.variants)}
            alt={`Photo shared by ${item.name}`}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="relative aspect-video w-full max-w-4xl">
            <iframe
              key={item.id}
              title={`Video shared by ${item.name}`}
              src={`https://iframe.videodelivery.net/${item.videoUid}?autoplay=true&controls=true&muted=false`}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Phones swipe; these are for mouse users. */}
        {([-1, 1] as const).map((delta) => (
          <button
            key={delta}
            type="button"
            onClick={() => onNavigate(delta)}
            aria-label={delta === -1 ? "Previous" : "Next"}
            className={`absolute top-1/2 hidden -translate-y-1/2 px-5 py-8 text-3xl opacity-60 hover:opacity-100 md:block ${
              delta === -1 ? "left-0" : "right-0"
            }`}
          >
            {delta === -1 ? "‹" : "›"}
          </button>
        ))}
      </div>

      <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-center">
        {item.name && <p className="text-xl italic">Shared by {item.name}</p>}
        <p className={`${label} mt-1 opacity-60`}>
          {formatMoment(item.timestamp)}
        </p>
      </div>
    </div>
  );
}
