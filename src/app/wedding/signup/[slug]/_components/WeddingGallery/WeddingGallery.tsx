"use client";

import { useEffect, useState } from "react";
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
import type { GalleryEntry } from "~/app/wedding/gallery-types";
import UploadModal from "../UploadImageOverlay/UploadImageOverlay";
import MediaDisplay from "../UserGallery/UserGallery";

const ITEMS_PER_PAGE = 50;

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      {account.showUpload && (
        <>
          <UploadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            slug={slug}
            account={account}
          />

          {/* Sticky rather than auto-opening over the gallery: guests come to
              look at photos as well as add them. */}
          {!isModalOpen && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-transform active:scale-95"
              style={{ background: account.textColor }}
            >
              + Add your photos &amp; videos
            </button>
          )}
        </>
      )}

      <MediaDisplay
        galleryItems={galleryItems}
        fetchError={fetchError}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={() => setPage((current) => current + 1)}
      />

      {/* Keeps the last row clear of the floating button. */}
      {account.showUpload && <div className="h-20" aria-hidden="true" />}
    </>
  );
}
