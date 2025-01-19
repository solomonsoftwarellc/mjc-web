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

const ITEMS_PER_PAGE = 50;

export default function SignupSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [fetchedImages, setFetchedImages] = useState<FirestoreImageDoc[]>([]);
  const [fetchedVideos, setFetchedVideos] = useState<FirestoreVideoDoc[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  if (!allowedSlugs.includes(slug)) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-start bg-gradient-to-b from-[#efe6dd] to-[#efe6dd] text-[#b8966f]">
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
