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
} from "firebase/firestore";
import { db } from "firebaseConfig";

// Import your two components
import UploadModal from "./_components/UploadImageOverlay/UploadImageOverlay";
import MediaDisplay from "./_components/UserGallery/UserGallery";
import Image from "next/image";
import { Accounts } from "../../accounts";

// Allowed slugs

type BaseGalleryDoc = {
  name: string;
  fileName: string;
  timestamp: string;
  type: "image" | "video";
};

type GalleryImageDoc = BaseGalleryDoc & {
  type: "image";
  cfImageId: string;
  variants: string[];
};

type GalleryVideoDoc = BaseGalleryDoc & {
  type: "video";
  videoUid: string;
  status: VideoStatus;
  thumbnail?: string | null;
};

type VideoStatus =
  | {
      state?: string;
      errorReasonCode?: string;
      errorReasonText?: string;
    }
  | string;

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

  const [galleryItems, setGalleryItems] = useState<
    (GalleryImageDoc | GalleryVideoDoc)[]
  >([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  const allowedSlugs = Object.keys(Accounts);

  useEffect(() => {
    if (!allowedSlugs.includes(slug)) {
      router.replace("/404");
      return;
    }

    const galleryRef = collection(db, "weddings", slug, "gallery");
    const galleryQuery = query(
      galleryRef,
      orderBy("timestamp", "desc"),
      limit(currentPage * ITEMS_PER_PAGE),
    );

    const checkHasMore = async () => {
      const nextQuery = query(
        galleryRef,
        orderBy("timestamp", "desc"),
        limit((currentPage + 1) * ITEMS_PER_PAGE),
      );

      const snap = await getDocs(nextQuery);
      const nextPageHasData = snap.docs.length > currentPage * ITEMS_PER_PAGE;
      setHasMore(nextPageHasData);
    };

    const unsubscribe = onSnapshot(
      galleryQuery,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => doc.data() as GalleryImageDoc | GalleryVideoDoc,
        );
        setGalleryItems(docs);
      },
      (error: FirestoreError) => {
        console.error("Error fetching gallery:", error);
        setFetchError(error.message || "Failed to fetch media.");
      },
    );

    checkHasMore().catch(console.error);

    return () => {
      unsubscribe();
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
            fetch("https://mashadi.phantomcheckerapi.com/upload", {
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
              fetch("https://mashadi.phantomcheckerapi.com/upload-video", {
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

  if (!allowedSlugs.includes(slug)) {
    return null;
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-start bg-gradient-to-b`}
      style={{
        color: Accounts[slug as keyof typeof Accounts].textColor,
        background: Accounts[slug as keyof typeof Accounts].backgroundColor,
      }}
    >
      {isUploading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center space-y-4">
            <div
              className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
              style={{
                borderColor: Accounts[slug as keyof typeof Accounts].textColor,
              }}
            ></div>
            <p
              className="text-lg font-semibold"
              style={{
                color: Accounts[slug as keyof typeof Accounts].textColor,
              }}
            >
              Uploading...
            </p>
          </div>
        </div>
      )}

      <div className="flex h-12 w-full flex-row items-center justify-start pl-4 pr-4 pt-4">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
          href="/"
        >
          <h3
            className="text-2xl font-bold"
            style={{ color: Accounts[slug as keyof typeof Accounts].textColor }}
          >
            Home
          </h3>
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
            {Accounts[slug as keyof typeof Accounts].name}
          </h2>
          <p className="text-center font-['Times_New_Roman'] text-lg">
            {Accounts[slug as keyof typeof Accounts].date}
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
          galleryItems={galleryItems}
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
