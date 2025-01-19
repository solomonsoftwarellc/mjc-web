"use client";

// Force dynamic rendering if desired
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  collection,
  onSnapshot,
  FirestoreError,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "firebaseConfig";

// Import your two components
import UploadModal from "./_components/UploadImageOverlay/UploadImageOverlay";
import MediaDisplay from "./_components/UserGallery/UserGallery";
import Image from "next/image";

// Allowed slugs
const allowedSlugs = [
  "david-charlotte",
  "test-slug",
  "another-one",
  "another-one2",
];

type FirestoreImageDoc = {
  id?: string;
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
  id?: string;
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

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!allowedSlugs.includes(slug)) {
      router.replace("/404");
      return;
    }

    const imagesRef = collection(db, "weddings", slug, "images");
    const videosRef = collection(db, "weddings", slug, "videos");

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
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as FirestoreImageDoc),
        }));
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
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as FirestoreVideoDoc),
        }));
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

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      setUploadStatus("Uploading media...");

      const uploadPromises = [];

      try {
        if (images.length > 0) {
          const imageFormData = new FormData();
          imageFormData.append("name", name);
          imageFormData.append("slug", slug);

          images.forEach((imageData, index) => {
            imageFormData.append("images", imageData.file);
            if (imageData.timestamp) {
              imageFormData.append(
                `imageMetadata_${index}`,
                JSON.stringify({
                  timestamp: imageData.timestamp.toISOString(),
                }),
              );
            }
          });

          uploadPromises.push(
            fetch("https://cd.phantomcheckerapi.com/upload", {
              method: "POST",
              body: imageFormData,
            }),
          );
        }
      } catch (error) {}

      try {
        if (videoFiles.length > 0) {
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

            uploadPromises.push(
              fetch("https://cd.phantomcheckerapi.com/upload-video", {
                method: "POST",
                body: videoFormData,
              }),
            );
          }
        }
      } catch (error) {}

      await Promise.all(uploadPromises);

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
      if (error instanceof Error) {
        setUploadStatus(`Upload failed: ${error.message}`);
      } else {
        setUploadStatus("Upload failed. Please try again.");
      }
    }
  };

  const handleDelete = async (
    type: "image" | "video",
    docData: FirestoreImageDoc | FirestoreVideoDoc,
  ) => {
    if (!docData.id) {
      console.error("No document ID found");
      setUploadStatus("Failed to delete item: No document ID");
      return;
    }

    try {
      console.log(type);
      const collectionName = type === "image" ? "images" : "images";
      console.log("Deleting", docData.id, "from", collectionName, "in", slug);
      const docRef = doc(db, "weddings", slug, collectionName, docData.id);
      await deleteDoc(docRef);

      setUploadStatus("Item deleted successfully");
      setTimeout(() => setUploadStatus(null), 2000);
    } catch (error) {
      console.error("Delete error:", error);
      setUploadStatus("Failed to delete item");
      setTimeout(() => setUploadStatus(null), 2000);
    }
  };

  if (!allowedSlugs.includes(slug)) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-start bg-gradient-to-b from-[#efe6dd] to-[#efe6dd] text-[#b8966f]">
      {isUploading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#b8966f] border-t-transparent"></div>
            <p className="text-lg font-semibold text-[#b8966f]">Uploading...</p>
          </div>
        </div>
      )}

      <div className="flex h-12 w-full flex-row items-center justify-start pl-4 pr-4 pt-4">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
          href="/"
        >
          <h3 className="text-2xl font-bold text-[#b8966f]">Home</h3>
        </Link>
      </div>

      <div className="container mx-auto flex flex-col gap-12 px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Image
            src={`/wedding/${slug}.png`}
            alt={`${slug} wedding banner`}
            width={800}
            height={200}
            className="w-[60%] object-contain transition-all duration-300 sm:w-[40%] md:w-[30%] lg:w-[20%]"
            priority
          />
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Charlotte &amp; David Kalaty&apos;s Wedding
          </h2>
          <p className="text-center font-['Times_New_Roman'] text-lg">
            January 19, 2025
          </p>
        </div>

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

        <MediaDisplay
          fetchedImages={fetchedImages}
          fetchedVideos={fetchedVideos}
          fetchError={fetchError}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          hasMore={hasMore}
          itemsPerPage={ITEMS_PER_PAGE}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
