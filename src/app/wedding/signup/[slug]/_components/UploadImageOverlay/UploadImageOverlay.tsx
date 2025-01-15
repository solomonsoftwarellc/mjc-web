"use client";

import React, { useRef, useEffect } from "react";

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
  handleSubmit: () => Promise<void>;
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
  const isFirstRender = useRef(true);
  const processingFiles = useRef(false);
  const hasUploaded = useRef(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!processingFiles.current && !hasUploaded.current) {
      if (images.length > 0 || videoFiles.length > 0) {
        hasUploaded.current = true;
        void handleSubmit();

        // clear the images and video files
        setImages([]);
        setVideoFiles([]);
        onClose();
      }
    }
  }, [images, videoFiles, handleSubmit, onClose, setImages, setVideoFiles]);

  const handleMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!e.target.files?.length) return;

    processingFiles.current = true;
    hasUploaded.current = false;

    const files = Array.from(e.target.files);

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const vidFiles = files.filter((file) => file.type.startsWith("video/"));

    const processedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const metadata: ImageWithMetadata = { file };
        try {
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.src = url;

          await new Promise((resolve) => {
            img.onload = resolve;
          });

          URL.revokeObjectURL(url);

          if (file.type === "image/jpeg" || file.type === "image/jpg") {
            const arrayBuffer = await file.arrayBuffer();
            const view = new DataView(arrayBuffer);

            if (view.getUint16(0, false) === 0xffd8) {
              let offset = 2;
              while (offset < view.byteLength) {
                if (view.getUint16(offset, false) === 0xffe1) {
                  metadata.timestamp = new Date(file.lastModified);
                  break;
                }
                offset += 2 + view.getUint16(offset + 2, false);
              }
            }
          }

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

    const processedVideos: VideoWithMetadata[] = vidFiles.map((file) => ({
      file,
      timestamp: new Date(file.lastModified),
    }));

    setImages((prev) => [...prev, ...processedImages]);
    setVideoFiles((prev) => [...prev, ...processedVideos]);

    processingFiles.current = false;
  };

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

        <div className="space-y-4">
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
              <label
                htmlFor="media-upload"
                className="w-full cursor-pointer space-y-1 text-center"
              >
                <div className="flex justify-center text-sm text-[#b8966f]">
                  <span
                    className="relative rounded-md bg-[#efe6dd] font-medium text-[#b8966f]
                             focus-within:outline-none focus-within:ring-2 focus-within:ring-[#b8966f]
                             focus-within:ring-offset-2 hover:text-[#96785a]"
                  >
                    Upload media
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-[#b8966f]">
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
            <div className="text-center text-sm text-[#b8966f]">
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
