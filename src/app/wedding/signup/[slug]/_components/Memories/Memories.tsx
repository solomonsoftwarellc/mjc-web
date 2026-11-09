"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  collection,
  getCountFromServer,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "firebaseConfig";

import type { WeddingAccount } from "~/app/wedding/accounts";
import {
  thumbnailVariant,
  type GalleryEntry,
} from "~/app/wedding/gallery-types";
import UploadModal, {
  CAMERA_INPUT_ID,
  VIDEO_INPUT_ID,
  openPicker,
} from "../UploadImageOverlay/UploadImageOverlay";
import Lightbox from "./Lightbox";

const ITEMS_PER_PAGE = 50;

/**
 * A "day" of the celebration runs 5am to 5am, so photos from the dance floor
 * at 1am stay with the night they belong to.
 */
// shortcut: fixed UTC-5 (New York in winter), move the offset onto the account when a summer or non-Eastern wedding uses day tabs
const DAY_START_UTC = "T10:00:00.000Z";

function dayBounds(day: string) {
  const start = new Date(`${day}${DAY_START_UTC}`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return [start.toISOString(), end.toISOString()] as const;
}

const weekday = (day: string, weekday: "long" | "short" = "long") =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday,
    timeZone: "UTC",
  });

const label = "text-[11px] font-semibold uppercase tracking-[0.28em]";

export default function Memories({
  slug,
  account,
}: {
  slug: string;
  account: WeddingAccount;
}) {
  const [items, setItems] = useState<GalleryEntry[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const pageSize = page * ITEMS_PER_PAGE;
    const gallery = collection(db, "weddings", slug, "gallery");
    // The range is on the same field the query orders by, so a day tab needs
    // no composite index.
    const range = day
      ? [
          where("timestamp", ">=", dayBounds(day)[0]),
          where("timestamp", "<", dayBounds(day)[1]),
        ]
      : [];

    // Over-fetch by one document so "is there another page?" is answered by
    // the same subscription instead of a second full query.
    const unsubscribe = onSnapshot(
      query(gallery, ...range, orderBy("timestamp", "desc"), limit(pageSize + 1)),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as GalleryEntry,
        );
        setHasMore(docs.length > pageSize);
        setItems(docs.slice(0, pageSize));
        setFetchError(false);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        console.error("Error fetching gallery:", error);
        setFetchError(true);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [slug, page, day]);

  // The cover's "N memories shared" line. Purely decorative, so a failure
  // (offline, rules) just leaves it out.
  useEffect(() => {
    getCountFromServer(collection(db, "weddings", slug, "gallery"))
      .then((snapshot) => setTotal(snapshot.data().count))
      .catch(() => setTotal(null));
  }, [slug]);

  const closeViewer = useCallback(() => setSelectedIndex(null), []);
  const navigate = useCallback(
    (delta: -1 | 1) =>
      setSelectedIndex((current) =>
        current === null || items.length === 0
          ? current
          : (current + delta + items.length) % items.length,
      ),
    [items.length],
  );

  const pickDay = (next: string | null) => {
    // Re-tapping the current tab must not clear a gallery that will not reload.
    if (next === day) return;
    setDay(next);
    setPage(1);
    setIsLoading(true);
    setItems([]);
  };

  const [first, second] = account.couple.split(" & ");
  const script = { fontFamily: "var(--font-script), cursive" };
  const pill =
    "block w-full rounded-full border px-6 py-4 text-center transition-transform active:scale-[0.98]";

  return (
    <main
      className="min-h-screen bg-[var(--paper)] text-[color:var(--ink)] antialiased"
      style={
        {
          "--ink": account.textColor,
          "--paper": account.backgroundColor,
          "--line": `color-mix(in srgb, ${account.textColor} 22%, transparent)`,
          fontFamily: "var(--font-serif), Georgia, serif",
        } as React.CSSProperties
      }
    >
      {/* The front door */}
      <section className={`mx-auto flex min-h-[100svh] max-w-md flex-col items-center justify-center px-8 pt-12 text-center ${
          account.showUpload ? "pb-32" : "pb-12"
        }`}>
        {account.logo && (
          // Monograms come in every shape, so they are sized by height.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={account.logo}
            alt=""
            className="h-[7.5rem] w-auto max-w-[80%] object-contain"
          />
        )}
        <p className={`${label} mt-7 opacity-60`}>The wedding of</p>
        <h1 className="mt-3 text-6xl leading-[1.1]" style={script}>
          {first}
          {second && (
            <>
              <br />
              {/* The script's own ampersand reads as a squiggle; the serif
                  italic one matches the couple's invitation. */}
              <span
                className="mr-3 text-[0.8em] italic"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                &amp;
              </span>
              {second}
            </>
          )}
        </h1>
        <div className="my-6 h-px w-10 bg-[var(--line)]" aria-hidden="true" />
        <p className={label}>{account.dateLabel ?? account.date}</p>

        <div className="mt-10 flex w-full flex-col gap-3">
          {account.showUpload && (
            <button
              type="button"
              onClick={() => openPicker(CAMERA_INPUT_ID)}
              className={`${pill} ${label} border-[color:var(--ink)] bg-[var(--ink)] text-[color:var(--paper)]`}
            >
              Take a photo
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              galleryRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className={`${pill} ${label} border-[color:var(--line)]`}
          >
            Enter the gallery
          </button>
        </div>

        {total !== null && total > 0 && (
          <p className="mt-6 text-lg italic opacity-60">
            {total.toLocaleString()} {total === 1 ? "memory" : "memories"} shared
          </p>
        )}
      </section>

      {/* The gallery */}
      <section
        ref={galleryRef}
        aria-label="Gallery"
        className="mx-auto min-h-[100svh] max-w-3xl pb-16"
      >
        {account.eventDays && (
          <nav
            aria-label="Filter by day"
            className="sticky top-0 z-30 flex justify-center gap-8 border-b border-[color:var(--line)] bg-[var(--paper)] px-5 pt-[max(1rem,env(safe-area-inset-top))]"
          >
            {[null, ...account.eventDays].map((option) => (
              <button
                key={option ?? "all"}
                type="button"
                onClick={() => pickDay(option)}
                aria-pressed={day === option}
                className={`${label} -mb-px shrink-0 border-b pb-3 pt-1 ${
                  day === option
                    ? "border-[color:var(--ink)]"
                    : "border-transparent opacity-50"
                }`}
              >
                {option ? weekday(option, "short") : "All"}
              </button>
            ))}
          </nav>
        )}

        <div className="px-2 pt-2">
          {isLoading && items.length === 0 && (
            <div className="columns-2 gap-2 sm:columns-3" aria-hidden="true">
              {[56, 40, 44, 60, 48, 36].map((height, index) => (
                <div
                  key={index}
                  className="mb-2 animate-pulse break-inside-avoid rounded-sm bg-[var(--line)] opacity-40"
                  style={{ height: `${height * 4}px` }}
                />
              ))}
            </div>
          )}

          {fetchError && (
            <p className="px-6 py-24 text-center text-xl italic opacity-70">
              The gallery could not be loaded. Please check your connection and
              try again.
            </p>
          )}

          {!isLoading && !fetchError && items.length === 0 && (
            <p className="px-6 py-24 text-center text-2xl italic opacity-70">
              {day
                ? `Nothing from ${weekday(day)} yet.`
                : "The first memory is yours to share."}
            </p>
          )}

          <div className="columns-2 gap-2 sm:columns-3">
            {items.map((item, index) => {
              const preview =
                item.type === "image"
                  ? thumbnailVariant(item.variants)
                  : item.thumbnail;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Open ${item.type === "video" ? "video" : "photo"} shared by ${item.name}`}
                  className="relative mb-2 block w-full break-inside-avoid overflow-hidden rounded-sm bg-[var(--line)]"
                >
                  {preview ? (
                    // Cloudflare already serves resized, cached variants, so
                    // next/image would only add a second optimizer hop.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt=""
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      className="block h-auto min-h-24 w-full"
                    />
                  ) : (
                    <span className="flex aspect-square items-center justify-center text-base italic opacity-70">
                      {item.type === "video" ? "Video processing..." : ""}
                    </span>
                  )}
                  {item.type === "video" && preview && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 pl-0.5 text-sm text-white backdrop-blur-sm"
                    >
                      ▶
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {hasMore && items.length > 0 && (
            <div className="flex justify-center px-6 pt-8">
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                className={`${pill} ${label} max-w-xs border-[color:var(--line)]`}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </section>

      <p className="pb-32 text-center">
        <Link href="/wedding" className={`${label} py-3 opacity-60`}>
          All weddings
        </Link>
      </p>

      {account.showUpload && (
        <>
          <nav
            aria-label="Share"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--line)] bg-[var(--paper)] pb-[env(safe-area-inset-bottom)]"
          >
            <div className="mx-auto grid h-[4.5rem] max-w-md grid-cols-3 items-center">
              <button
                type="button"
                onClick={() => setIsSheetOpen(true)}
                className={`${label} h-full`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => openPicker(CAMERA_INPUT_ID)}
                aria-label="Take a photo"
                className="mx-auto -mt-8 h-[4.25rem] w-[4.25rem] rounded-full border border-[color:var(--ink)] bg-[var(--paper)] p-1.5 transition-transform active:scale-95"
              >
                <span className="block h-full w-full rounded-full bg-[var(--ink)]" />
              </button>
              <button
                type="button"
                onClick={() => openPicker(VIDEO_INPUT_ID)}
                className={`${label} h-full`}
              >
                Video
              </button>
            </div>
          </nav>

          <UploadModal
            isOpen={isSheetOpen}
            onOpen={() => setIsSheetOpen(true)}
            onClose={() => setIsSheetOpen(false)}
            slug={slug}
            account={account}
          />
        </>
      )}

      {selectedIndex !== null && (
        <Lightbox
          items={items}
          index={selectedIndex}
          onClose={closeViewer}
          onNavigate={navigate}
        />
      )}
    </main>
  );
}
