"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fullVariant,
  thumbnailVariant,
  type GalleryEntry,
} from "~/app/wedding/gallery-types";

type MediaDisplayProps = {
  galleryItems: GalleryEntry[];
  fetchError: string | null;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

function PlayBadge() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="rounded-full bg-black/50 p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z"
          />
        </svg>
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6 md:h-8 md:w-8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={
          direction === "left"
            ? "M15.75 19.5L8.25 12l7.5-7.5"
            : "M8.25 4.5l7.5 7.5-7.5 7.5"
        }
      />
    </svg>
  );
}

export default function MediaDisplay({
  galleryItems,
  fetchError,
  isLoading,
  hasMore,
  onLoadMore,
}: MediaDisplayProps) {
  // Firestore already returns the gallery ordered by timestamp desc, so the
  // render order is the query order - no client-side re-sort per render.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedMedia =
    selectedIndex === null ? null : (galleryItems[selectedIndex] ?? null);

  const close = useCallback(() => setSelectedIndex(null), []);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      setSelectedIndex((current) => {
        if (current === null || galleryItems.length === 0) return current;
        const delta = direction === "prev" ? -1 : 1;
        return (current + delta + galleryItems.length) % galleryItems.length;
      });
    },
    [galleryItems.length],
  );

  // Keyboard navigation and background scroll lock while the lightbox is open.
  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") navigate("prev");
      else if (event.key === "ArrowRight") navigate("next");
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, close, navigate]);

  return (
    <div className="container flex flex-col gap-12 px-4 py-8">
      {fetchError && (
        <p className="text-red-500">Error loading: {fetchError}</p>
      )}

      {isLoading && galleryItems.length === 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="aspect-square w-full animate-pulse rounded-md bg-black/10"
            />
          ))}
        </div>
      )}

      {!isLoading && galleryItems.length === 0 && !fetchError && (
        <p className="py-12 text-center text-lg opacity-70">
          No photos or videos have been shared yet.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {galleryItems.map((item, index) => {
          const preview =
            item.type === "image"
              ? thumbnailVariant(item.variants)
              : item.thumbnail;

          return (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center gap-4"
            >
              <button
                type="button"
                className="relative aspect-square w-full cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Open ${item.fileName}`}
              >
                {preview ? (
                  // Cloudflare Images/Stream already serve resized, cached
                  // variants, so next/image would only add a second optimizer
                  // hop and extra billed transforms.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt={item.fileName}
                    // The first row is usually above the fold; everything after
                    // it waits until the browser scrolls near it.
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className={`h-full w-full ${
                      item.type === "image" ? "object-contain" : "object-cover"
                    }`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-black/10">
                    <p className="text-xs italic opacity-60">
                      {item.type === "video"
                        ? "Video processing..."
                        : "No preview"}
                    </p>
                  </div>
                )}
                {item.type === "video" && <PlayBadge />}
              </button>

              <div className="text-center text-sm">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs opacity-60">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && galleryItems.length > 0 && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onLoadMore}
            className="rounded-lg bg-black/10 px-6 py-3 font-semibold transition-colors hover:bg-black/20"
          >
            Load More
          </button>
        </div>
      )}

      {selectedMedia && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedMedia.fileName}
          className="fixed inset-0 z-50 bg-black/90 p-4 md:p-8"
          onClick={close}
        >
          <div className="relative flex h-full items-center justify-center">
            <button
              onClick={(event) => {
                event.stopPropagation();
                navigate("prev");
              }}
              className="absolute left-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:left-8"
              aria-label="Previous"
            >
              <Chevron direction="left" />
            </button>

            {selectedMedia.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fullVariant(selectedMedia.variants)}
                alt={selectedMedia.fileName}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(event) => event.stopPropagation()}
              />
            ) : (
              <div
                className="relative w-full max-w-4xl md:w-[80vw]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="aspect-video">
                  <iframe
                    title={selectedMedia.fileName}
                    src={`https://iframe.videodelivery.net/${selectedMedia.videoUid}?autoplay=true&controls=true&muted=false`}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <button
              onClick={(event) => {
                event.stopPropagation();
                navigate("next");
              }}
              className="absolute right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:right-8"
              aria-label="Next"
            >
              <Chevron direction="right" />
            </button>
          </div>

          <button
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
