"use client";

// Force dynamic rendering if desired
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  FirestoreError,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "firebaseConfig";

// Import your two components
import UploadModal from "./_components/UploadImageOverlay/UploadImageOverlay";
import MediaDisplay from "./_components/UserGallery/UserGallery";

// Allowed slugs
const allowedSlugs = ["david-charlotte", "test-slug", "another-one"];

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

// Update the type definitions
type ImageWithMetadata = {
  file: File;
  timestamp?: Date;
};

// Add new type definition
type VideoWithMetadata = {
  file: File;
  timestamp?: Date;
  duration?: number;
};

// Add these constants at the top
const ITEMS_PER_PAGE = 50;

export default function SignupSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [images, setImages] = useState<ImageWithMetadata[]>([]);
  const [videoFiles, setVideoFiles] = useState<VideoWithMetadata[]>([]);
  const [name, setName] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [fetchedImages, setFetchedImages] = useState<FirestoreImageDoc[]>([]);
  const [fetchedVideos, setFetchedVideos] = useState<FirestoreVideoDoc[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Check if slug is allowed
    if (!allowedSlugs.includes(slug)) {
      router.replace("/404");
      return;
    }

    const imagesRef = collection(db, "weddings", slug, "images");
    const videosRef = collection(db, "weddings", slug, "videos");

    // Update queries to use currentPage for pagination
    const imagesQuery = query(
      imagesRef,
      orderBy("timestamp", "desc"),
      limit(currentPage * (ITEMS_PER_PAGE / 2)),
    );

    const videosQuery = query(
      videosRef,
      orderBy("timestamp", "desc"),
      limit(currentPage * (ITEMS_PER_PAGE / 2)),
    );

    // Add logic to check if there's more data
    const checkHasMore = async () => {
      const nextImagesQuery = query(
        imagesRef,
        orderBy("timestamp", "desc"),
        limit((currentPage + 1) * (ITEMS_PER_PAGE / 2)),
      );
      const nextVideosQuery = query(
        videosRef,
        orderBy("timestamp", "desc"),
        limit((currentPage + 1) * (ITEMS_PER_PAGE / 2)),
      );

      const [imagesSnap, videosSnap] = await Promise.all([
        getDocs(nextImagesQuery),
        getDocs(nextVideosQuery),
      ]);

      const nextPageHasData =
        imagesSnap.docs.length > currentPage * (ITEMS_PER_PAGE / 2) ||
        videosSnap.docs.length > currentPage * (ITEMS_PER_PAGE / 2);

      setHasMore(nextPageHasData);
    };

    const unsubscribeImages = onSnapshot(
      imagesQuery,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => doc.data() as FirestoreImageDoc,
        );
        setFetchedImages(docs);
      },
      (error: FirestoreError) => {
        console.error("Error fetching Firestore images:", error);
        setFetchError(error.message || "Failed to fetch images.");
      },
    );

    const unsubscribeVideos = onSnapshot(
      videosQuery,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => doc.data() as FirestoreVideoDoc,
        );
        setFetchedVideos(docs);
      },
      (error: FirestoreError) => {
        console.error("Error fetching Firestore videos:", error);
        setFetchError(error.message || "Failed to fetch videos.");
      },
    );

    checkHasMore().catch(console.error);

    return () => {
      unsubscribeImages();
      unsubscribeVideos();
    };
  }, [slug, router, currentPage]);

  // Handle the form submission for images/videos
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit called");
    e.preventDefault();
    try {
      // Handle Images Upload
      console.log("images", images.length);
      console.log("videoFiles", videoFiles.length);
      if (images.length > 0) {
        const imageFormData = new FormData();
        imageFormData.append("name", name);
        imageFormData.append("slug", slug);

        // Add each image and its metadata
        images.forEach((imageData, index) => {
          imageFormData.append("images", imageData.file);
          if (imageData.timestamp) {
            imageFormData.append(
              `imageMetadata_${index}`,
              JSON.stringify({ timestamp: imageData.timestamp.toISOString() }),
            );
          }
        });

        const imageRes = await fetch(
          "https://cd.phantomcheckerapi.com/upload",
          {
            method: "POST",
            body: imageFormData,
          },
        );

        if (!imageRes.ok) {
          const errorText =
            typeof imageRes.statusText === "object"
              ? JSON.stringify(imageRes.statusText)
              : imageRes.statusText;
          setUploadStatus(`Image upload error: ${errorText}`);
          return;
        }

        const imageData = (await imageRes.json()) as {
          error?: { message: string } | string;
        };
        if (imageData.error) {
          const errorMessage =
            typeof imageData.error === "object"
              ? imageData.error.message
              : imageData.error;
          setUploadStatus(`Image upload error: ${errorMessage}`);
          return;
        }
      }

      // Handle Videos Upload
      if (videoFiles.length > 0) {
        const videoFormData = new FormData();
        videoFormData.append("name", name);
        videoFormData.append("slug", slug);

        // Add each video and its metadata
        videoFiles.forEach((videoData, index) => {
          videoFormData.append("videos", videoData.file);
          videoFormData.append(
            `videoMetadata_${index}`,
            JSON.stringify({
              timestamp: videoData.timestamp?.toISOString(),
              duration: videoData.duration,
            }),
          );
        });

        const videoRes = await fetch(
          "https://cd.phantomcheckerapi.com/upload-video",
          {
            method: "POST",
            body: videoFormData,
          },
        );

        if (!videoRes.ok) {
          const errorText =
            typeof videoRes.statusText === "object"
              ? JSON.stringify(videoRes.statusText)
              : videoRes.statusText;
          setUploadStatus(`Video upload error: ${errorText}`);
          return;
        }

        const videoData = (await videoRes.json()) as { success: boolean };
        if (!videoData.success) {
          setUploadStatus("Video upload failed.");
          return;
        }
      }

      setUploadStatus("Success! Uploaded media.");
      setImages([]);
      setVideoFiles([]);

      // Optionally close the modal on success
      // setIsModalOpen(false);
      setUploadStatus(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setUploadStatus(`Upload failed: ${error.message}`);
      } else {
        console.error("Unknown error occurred:", error);
        setUploadStatus("Upload failed. Check console for details.");
      }
    }
  };

  // If slug is not allowed, return null or your custom 404
  if (!allowedSlugs.includes(slug)) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {/* Header Link */}
      <div className="flex w-full flex-1 flex-row items-center justify-start pl-4 pr-4 pt-4">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
          href="/"
        >
          <h3 className="text-2xl font-bold">Home</h3>
        </Link>
      </div>

      {/* Main Container */}
      <div className="container flex flex-col gap-12 px-4 py-8">
        <h1 className="text-center text-3xl font-bold">
          Share Your Media - {slug}
        </h1>

        {/* Overlay for Upload (opens immediately) */}
        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          name={name}
          setName={setName}
          images={images}
          setImages={setImages}
          videoFiles={videoFiles}
          setVideoFiles={setVideoFiles}
          handleSubmit={handleSubmit}
          uploadStatus={uploadStatus}
        />

        {/* Display previously uploaded media */}
        <MediaDisplay
          fetchedImages={fetchedImages}
          fetchedVideos={fetchedVideos}
          fetchError={fetchError}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          hasMore={hasMore}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </main>
  );
}
