"use client";

import React, { useState } from "react";

type ImageWithMetadata = {
  file: File;
  timestamp?: Date;
};

type VideoWithMetadata = {
  file: File;
  timestamp?: Date;
  duration?: number;
};

type UploadModalProps = {
  onClose: () => void;
  isOpen: boolean;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  images: ImageWithMetadata[];
  setImages: React.Dispatch<React.SetStateAction<ImageWithMetadata[]>>;
  videoFiles: VideoWithMetadata[];
  setVideoFiles: React.Dispatch<React.SetStateAction<VideoWithMetadata[]>>;
  handleSubmit: (e: React.FormEvent) => void;
  uploadStatus: string | null;
};

export default function UploadModal({
  onClose,
  isOpen,
  name,
  setName,
  images,
  setImages,
  videoFiles,
  setVideoFiles,
  handleSubmit,
  uploadStatus,
}: UploadModalProps) {
  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const vidFiles = files.filter((file) => file.type.startsWith("video/"));

      // Process images to extract metadata
      const processedImages = await Promise.all(
        imageFiles.map(async (file) => {
          const metadata: ImageWithMetadata = { file };

          try {
            // Create a blob URL for the file
            const url = URL.createObjectURL(file);

            // Create an image element to load the file
            const img = new Image();
            img.src = url;

            await new Promise((resolve) => {
              img.onload = resolve;
            });

            // Clean up the blob URL
            URL.revokeObjectURL(url);

            // Try to get EXIF data for timestamp
            if (file.type === "image/jpeg" || file.type === "image/jpg") {
              const arrayBuffer = await file.arrayBuffer();
              const view = new DataView(arrayBuffer);

              // Look for EXIF marker
              if (view.getUint16(0, false) === 0xffd8) {
                let offset = 2;
                while (offset < view.byteLength) {
                  if (view.getUint16(offset, false) === 0xffe1) {
                    const exifLength = view.getUint16(offset + 2, false);
                    const exifData = new Uint8Array(
                      arrayBuffer,
                      offset,
                      exifLength,
                    );
                    // Here you would parse EXIF data to get DateTime
                    // For now, fallback to file's lastModified
                    metadata.timestamp = new Date(file.lastModified);
                    break;
                  }
                  offset += 2 + view.getUint16(offset + 2, false);
                }
              }
            }

            // Fallback to file's lastModified if no EXIF data
            if (!metadata.timestamp) {
              metadata.timestamp = new Date(file.lastModified);
            }
          } catch (error) {
            console.error("Error processing image metadata:", error);
            metadata.timestamp = new Date(file.lastModified);
          }

          return metadata;
        }),
      );

      // Process videos
      const processedVideos: VideoWithMetadata[] = vidFiles.map((file) => ({
        file,
        timestamp: new Date(file.lastModified),
      }));

      setImages(processedImages);
      setVideoFiles(processedVideos);
    }
  };

  // Add handler for background clicks
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackgroundClick}
    >
      {/* Modal Content */}
      <div className="w-full max-w-2xl rounded-lg bg-[#efe6dd] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-bold text-[#b8966f]">
            Upload Media
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#b8966f] hover:text-[#96785a]"
          >
            <span className="sr-only">Close Modal</span>✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#b8966f]"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-[#b8966f] bg-[#efe6dd] text-[#b8966f] shadow-sm
                         focus:border-[#b8966f] focus:ring-[#b8966f]"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#b8966f]">
              Upload Photos &amp; Videos
            </label>
            <div
              className="mt-1 flex justify-center rounded-md border-2 border-dashed
                            border-[#b8966f] px-6 pb-6 pt-5"
            >
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-[#b8966f]">
                  <label
                    htmlFor="media-upload"
                    className="relative cursor-pointer rounded-md bg-[#efe6dd] font-medium text-[#b8966f]
                               focus-within:outline-none focus-within:ring-2 focus-within:ring-[#b8966f]
                               focus-within:ring-offset-2 hover:text-[#96785a]"
                  >
                    <span>Upload media</span>
                    <input
                      id="media-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-[#b8966f]">
                  Images (PNG, JPG, GIF) &amp; Videos (MP4, MOV)
                </p>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {(images.length > 0 || videoFiles.length > 0) && (
            <div>
              <h4 className="text-sm font-medium text-[#b8966f]">
                Selected files:
              </h4>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={`img-${index}`}
                      className="relative aspect-square"
                    >
                      <img
                        src={URL.createObjectURL(image.file)}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full rounded-lg object-cover"
                        onLoad={() => {
                          URL.revokeObjectURL(URL.createObjectURL(image.file));
                        }}
                      />
                      {/* Add timestamp display if desired */}
                      {image.timestamp && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-xs text-white">
                          {image.timestamp.toLocaleString()}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Video Previews */}
              {videoFiles.length > 0 && (
                <div className="mt-4">
                  <div className="space-y-2">
                    {videoFiles.map((video, index) => (
                      <div
                        key={`video-${index}`}
                        className="relative rounded-lg bg-gray-100 p-2"
                      >
                        <p className="text-sm text-gray-600">
                          Selected video: {video.file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setVideoFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full justify-center rounded-md bg-[#b8966f] px-4 py-2 text-sm font-medium
                       text-white shadow-sm hover:bg-[#96785a] focus:outline-none
                       focus:ring-2 focus:ring-[#b8966f] focus:ring-offset-2"
          >
            Upload Media
          </button>
          {uploadStatus && (
            <div className="text-center text-sm text-[#b8966f]">
              {uploadStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
  