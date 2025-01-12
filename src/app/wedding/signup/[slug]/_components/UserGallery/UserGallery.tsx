"use client";

import React from "react";

type FirestoreImageDoc = {
  name: string;
  fileName: string;
  cfImageId: string;
  variants: string[];
  timestamp: string;
};

type VideoStatus =
  | {
      state?: string;
      errorReasonCode?: string;
      errorReasonText?: string;
    }
  | string;

type FirestoreVideoDoc = {
  name: string;
  fileName: string;
  videoUid: string;
  status: VideoStatus;
  thumbnail?: string | null;
  timestamp: string;
};

type MediaDisplayProps = {
  fetchedImages: FirestoreImageDoc[];
  fetchedVideos: FirestoreVideoDoc[];
  fetchError: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  hasMore: boolean;
  itemsPerPage: number;
};

export default function MediaDisplay({
  fetchedImages,
  fetchedVideos,
  fetchError,
  currentPage,
  setCurrentPage,
  hasMore,
}: MediaDisplayProps) {
  const [selectedMedia, setSelectedMedia] = React.useState<
    FirestoreImageDoc | FirestoreVideoDoc | null
  >(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const combinedMedia = [...fetchedImages, ...fetchedVideos].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const handleNavigate = (direction: "prev" | "next", e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex =
      direction === "prev"
        ? (selectedIndex - 1 + combinedMedia.length) % combinedMedia.length
        : (selectedIndex + 1) % combinedMedia.length;
    setSelectedIndex(newIndex);
    setSelectedMedia(combinedMedia[newIndex] ?? null);
  };

  const handleMediaClick = (
    item: FirestoreImageDoc | FirestoreVideoDoc,
    index: number,
  ) => {
    setSelectedMedia(item);
    setSelectedIndex(index);
  };

  return (
    <div className="container flex flex-col gap-12 px-4 py-8">
      {fetchError && (
        <p className="text-red-500">Error loading: {fetchError}</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {combinedMedia.map((item, index) => {
          const isImage = "variants" in item;
          const isVideo = "videoUid" in item;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-4"
            >
              <div
                className="relative aspect-square w-full cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]"
                onClick={() => handleMediaClick(item, index)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {isImage ? (
                    // IMAGE
                    item.variants?.[0] ? (
                      <img
                        src={item.variants[0]}
                        alt={item.fileName}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">
                        No image preview
                      </span>
                    )
                  ) : isVideo ? (
                    <div className="relative h-full w-full">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.fileName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-900">
                          <p className="text-xs italic text-gray-400">
                            Video processing...
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/50 p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-6 w-6 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="text-center text-sm">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && combinedMedia.length > 0 && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="rounded-lg bg-white/10 px-6 py-3 font-semibold hover:bg-white/20 disabled:opacity-50"
          >
            Load More
          </button>
        </div>
      )}

      {selectedMedia && (
        <dialog
          className="fixed inset-0 z-50 h-full w-full bg-black/90 p-4 md:p-8"
          open
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative flex h-full items-center justify-center">
            <button
              onClick={(e) => handleNavigate("prev", e)}
              className="absolute left-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:left-8"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6 md:h-8 md:w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            {"variants" in selectedMedia ? (
              <img
                src={selectedMedia.variants[0]}
                alt={selectedMedia.fileName}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : "videoUid" in selectedMedia ? (
              <div
                className="relative w-full max-w-4xl md:w-[80vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video">
                  <iframe
                    src={`https://iframe.videodelivery.net/${selectedMedia.videoUid}?autoplay=true&controls=true&muted=false`}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            <button
              onClick={(e) => handleNavigate("next", e)}
              className="absolute right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:right-8"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6 md:h-8 md:w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setSelectedMedia(null)}
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </dialog>
      )}
    </div>
  );
}
