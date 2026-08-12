"use client";

import React, { useEffect, useRef } from "react";
import type { WeddingAccount } from "~/app/wedding/accounts";
import type {
  ImageWithMetadata,
  VideoWithMetadata,
} from "~/app/wedding/gallery-types";

type UploadModalProps = {
  onClose: () => void;
  isOpen: boolean;
  account: WeddingAccount;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  images: ImageWithMetadata[];
  setImages: React.Dispatch<React.SetStateAction<ImageWithMetadata[]>>;
  videoFiles: VideoWithMetadata[];
  setVideoFiles: React.Dispatch<React.SetStateAction<VideoWithMetadata[]>>;
  handleSubmit: () => Promise<void>;
  uploadStatus: string | null;
};

/**
 * Reads the capture time for an image. JPEGs carry it in EXIF, but the original
 * implementation only ever checked that an EXIF block exists and then used the
 * file's own mtime, so that is what we do directly.
 */
function readTimestamp(file: File): Date {
  return new Date(file.lastModified);
}

export default function UploadModal({
  onClose,
  isOpen,
  account,
  name,
  setName,
  images,
  setImages,
  videoFiles,
  setVideoFiles,
  handleSubmit,
  uploadStatus,
}: UploadModalProps) {
  const isFirstRender = useRef(true);
  const processingFiles = useRef(false);
  const hasUploaded = useRef(false);

  useEffect(() => {
    const savedName = localStorage.getItem("uploaderName");
    if (savedName) {
      setName(savedName);
    }
  }, [setName]);

  useEffect(() => {
    if (name) {
      localStorage.setItem("uploaderName", name);
    }
  }, [name]);

  // Selecting files submits immediately - the picker is the only step.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (processingFiles.current || hasUploaded.current) return;
    if (images.length === 0 && videoFiles.length === 0) return;

    hasUploaded.current = true;
    void handleSubmit();
    setImages([]);
    setVideoFiles([]);
    onClose();
  }, [images, videoFiles, handleSubmit, onClose, setImages, setVideoFiles]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    processingFiles.current = true;
    hasUploaded.current = false;

    const files = Array.from(e.target.files);

    const processedImages: ImageWithMetadata[] = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, timestamp: readTimestamp(file) }));

    const processedVideos: VideoWithMetadata[] = files
      .filter((file) => file.type.startsWith("video/"))
      .map((file) => ({ file, timestamp: readTimestamp(file) }));

    processingFiles.current = false;

    setImages((prev) => [...prev, ...processedImages]);
    setVideoFiles((prev) => [...prev, ...processedVideos]);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const accent = { color: account.textColor };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackgroundClick}
    >
      <div
        className="w-full max-w-2xl rounded-lg p-6 shadow-xl"
        style={{ background: account.backgroundColor }}
      >
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-bold" style={accent}>
            Upload Media
          </h2>
          <button type="button" onClick={onClose} style={accent}>
            <span className="sr-only">Close Modal</span>✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium"
              style={accent}
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border shadow-sm focus:outline-none focus:ring-2"
              style={{
                background: account.backgroundColor,
                borderColor: account.textColor,
                color: account.textColor,
              }}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" style={accent}>
              Upload Photos &amp; Videos
            </label>
            <div
              className="mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5"
              style={{ borderColor: account.textColor }}
            >
              <label
                htmlFor="media-upload"
                className="w-full cursor-pointer space-y-1 text-center"
                style={accent}
              >
                <div className="flex justify-center text-sm">
                  <span className="font-medium">Upload media</span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs">
                  Images (PNG, JPG, GIF) &amp; Videos (MP4, MOV)
                </p>
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {uploadStatus && (
            <div className="text-center text-sm" style={accent}>
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
