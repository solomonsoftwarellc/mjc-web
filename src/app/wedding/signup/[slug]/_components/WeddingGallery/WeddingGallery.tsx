"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "firebaseConfig";

import type { WeddingAccount } from "~/app/wedding/accounts";
import type {
  GalleryEntry,
  ImageWithMetadata,
  VideoWithMetadata,
} from "~/app/wedding/gallery-types";
import UploadModal from "../UploadImageOverlay/UploadImageOverlay";
import MediaDisplay from "../UserGallery/UserGallery";

const ITEMS_PER_PAGE = 50;
const UPLOAD_ENDPOINT = "https://mashadi.phantomcheckerapi.com";

export default function WeddingGallery({
  slug,
  account,
}: {
  slug: string;
  account: WeddingAccount;
}) {
  const [galleryItems, setGalleryItems] = useState<GalleryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [images, setImages] = useState<ImageWithMetadata[]>([]);
  const [videoFiles, setVideoFiles] = useState<VideoWithMetadata[]>([]);
  const [name, setName] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const pageSize = page * ITEMS_PER_PAGE;

    // Over-fetch by one document so "is there another page?" is answered by the
    // same subscription instead of a second full query.
    const galleryQuery = query(
      collection(db, "weddings", slug, "gallery"),
      orderBy("timestamp", "desc"),
      limit(pageSize + 1),
    );

    const unsubscribe = onSnapshot(
      galleryQuery,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as GalleryEntry,
        );
        setHasMore(docs.length > pageSize);
        setGalleryItems(docs.slice(0, pageSize));
        setFetchError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        console.error("Error fetching gallery:", error);
        setFetchError(error.message || "Failed to fetch media.");
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [slug, page]);

  const handleSubmit = useCallback(async () => {
    setIsUploading(true);
    setUploadStatus("Uploading media...");

    try {
      const uploads: Promise<Response>[] = [];

      if (images.length > 0) {
        const imageFormData = new FormData();
        imageFormData.append("name", name);
        imageFormData.append("slug", slug);

        images.forEach((imageData, index) => {
          imageFormData.append("images", imageData.file);
          if (imageData.timestamp) {
            imageFormData.append(
              `imageMetadata_${index}`,
              JSON.stringify({ timestamp: imageData.timestamp.toISOString() }),
            );
          }
        });

        uploads.push(
          fetch(`${UPLOAD_ENDPOINT}/upload`, {
            method: "POST",
            body: imageFormData,
          }),
        );
      }

      for (const videoData of videoFiles) {
        const videoFormData = new FormData();
        videoFormData.append("name", name);
        videoFormData.append("slug", slug);
        videoFormData.append("videos", videoData.file);
        videoFormData.append(
          "videoMetadata_0",
          JSON.stringify({
            timestamp: videoData.timestamp?.toISOString(),
            duration: videoData.duration,
          }),
        );

        uploads.push(
          fetch(`${UPLOAD_ENDPOINT}/upload-video`, {
            method: "POST",
            body: videoFormData,
          }),
        );
      }

      const responses = await Promise.all(uploads);
      const failed = responses.find((response) => !response.ok);
      if (failed) {
        throw new Error(`Server responded with ${failed.status}`);
      }

      setUploadStatus("Success! Uploaded media.");
      setImages([]);
      setVideoFiles([]);
      setIsModalOpen(false);

      setTimeout(() => {
        setUploadStatus(null);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadStatus(
        error instanceof Error
          ? `Upload failed: ${error.message}`
          : "Upload failed. Please try again.",
      );
    }
  }, [images, videoFiles, name, slug]);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      {isUploading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center space-y-4">
            <div
              className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
              style={{ borderColor: account.textColor }}
            />
            <p
              className="text-lg font-semibold"
              style={{ color: account.textColor }}
            >
              Uploading...
            </p>
          </div>
        </div>
      )}

      {account.showUpload && (
        <UploadModal
          isOpen={isModalOpen}
          onClose={closeModal}
          account={account}
          name={name}
          setName={setName}
          images={images}
          setImages={setImages}
          videoFiles={videoFiles}
          setVideoFiles={setVideoFiles}
          handleSubmit={handleSubmit}
          uploadStatus={uploadStatus}
        />
      )}

      <MediaDisplay
        galleryItems={galleryItems}
        fetchError={fetchError}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={() => setPage((current) => current + 1)}
      />
    </>
  );
}
