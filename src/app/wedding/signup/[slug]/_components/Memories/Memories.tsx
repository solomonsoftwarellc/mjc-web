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
  isShabbat,
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

/** Height over width assumed for a photo until it has loaded. */
const DEFAULT_RATIO = 1.25;

type Placed = { item: GalleryEntry; index: number };

/**
 * Deal the posts into columns, each new one onto the shortest column.
 *
 * A post keeps the column it was first given (`placed`), so loading more or a
 * new upload never moves a photo sideways. CSS `columns` re-balances the whole
 * wall on every change, which is what made the gallery jump.
 */
function dealIntoColumns(
  items: GalleryEntry[],
  count: number,
  placed: Map<string, number>,
  ratios: Map<string, number>,
) {
  const columns = Array.from({ length: count }, (): Placed[] => []);
  const heights = columns.map(() => 0);
  const grow = (column: number, item: GalleryEntry) => {
    heights[column] =
      (heights[column] ?? 0) + (ratios.get(item.id) ?? DEFAULT_RATIO);
  };

  for (const item of items) {
    const column = placed.get(item.id);
    if (column !== undefined) grow(column, item);
  }

  items.forEach((item, index) => {
    let column = placed.get(item.id);
    if (column === undefined) {
      column = heights.indexOf(Math.min(...heights));
      placed.set(item.id, column);
      grow(column, item);
    }
    columns[column]?.push({ item, index });
  });

  return columns;
}

/** Two columns on a phone, three from Tailwind's `sm` breakpoint up. */
function useColumnCount() {
  const [count, setCount] = useState(2);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 640px)");
    const sync = () => setCount(wide.matches ? 3 : 2);
    sync();
    wide.addEventListener("change", sync);
    return () => wide.removeEventListener("change", sync);
  }, []);

  return count;
}

/**
 * True when `item` sorts at or after `last` in the gallery query, which orders
 * by timestamp and then document id, both descending.
 */
const isAtOrAfter = (item: GalleryEntry, last: GalleryEntry) =>
  item.timestamp < last.timestamp ||
  (item.timestamp === last.timestamp && item.id <= last.id);

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
  /** The page the server has answered for; behind `page` while one loads. */
  const [loadedPage, setLoadedPage] = useState(0);
  /** Every post in the current tab, not just the ones loaded so far. */
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showShabbatNotice, setShowShabbatNotice] = useState(false);
  /** Every way into posting goes through here; looking is never blocked. */
  const post = (action: () => void) => () =>
    isShabbat() ? setShowShabbatNotice(true) : action();
  const galleryRef = useRef<HTMLElement>(null);

  /** Posts that arrived while the guest was looking further down. */
  const [heldIds, setHeldIds] = useState<ReadonlySet<string>>(new Set());
  /** Every post id this view has been sent, to tell new uploads from old. */
  const knownIds = useRef(new Set<string>());
  const isViewerOpen = useRef(false);
  isViewerOpen.current = selectedIndex !== null;

  const columnCount = useColumnCount();
  const layout = useRef({
    count: columnCount,
    placed: new Map<string, number>(),
  });
  /** Height over width of each thumbnail that has loaded. */
  const ratios = useRef(new Map<string, number>());

  const firstDay = account.eventDays?.[0];

  useEffect(() => {
    const pageSize = page * ITEMS_PER_PAGE;
    const gallery = collection(db, "weddings", slug, "gallery");
    // The range is on the same field the query orders by, so a day tab needs
    // no composite index.
    // The first day has no lower bound, so anything shared (or dated) before
    // the celebration lands there instead of only under "All".
    const range = day
      ? [
          ...(day === firstDay
            ? []
            : [where("timestamp", ">=", dayBounds(day)[0])]),
          where("timestamp", "<", dayBounds(day)[1]),
        ]
      : [];

    let isActive = true;
    // Over-fetch by one document so "is there another page?" is answered by
    // the same subscription instead of a second full query.
    const unsubscribe = onSnapshot(
      query(
        gallery,
        ...range,
        orderBy("timestamp", "desc"),
        limit(pageSize + 1),
      ),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as GalleryEntry,
        );
        const isWindowFull = docs.length > pageSize;
        // Growing the window first answers from the local cache with only the
        // posts already shown, which would flash the end of the gallery.
        if (snapshot.metadata.fromCache && !isWindowFull && page > 1) return;

        if (!snapshot.metadata.fromCache) {
          // Refreshed on every server answer so new uploads count too.
          getCountFromServer(query(gallery, ...range))
            .then((count) => isActive && setTotal(count.data().count))
            .catch((error) => console.error("Error counting gallery:", error));
        }
        const fresh = docs.slice(0, pageSize);
        const freshIds = new Set(fresh.map((doc) => doc.id));
        const last = docs[docs.length - 1];

        // New uploads sit above the first post this view already knows.
        const firstKnown = fresh.findIndex((doc) =>
          knownIds.current.has(doc.id),
        );
        const arrivals =
          knownIds.current.size === 0
            ? []
            : firstKnown === -1
              ? fresh
              : fresh.slice(0, firstKnown);
        fresh.forEach((doc) => knownIds.current.add(doc.id));

        // Dropping them in above a guest who has scrolled down, or who has a
        // photo open, would push everything they are looking at. Hold them
        // behind the "new posts" button instead.
        const isLookingElsewhere =
          isViewerOpen.current ||
          (galleryRef.current?.getBoundingClientRect().top ?? 0) < -120;
        if (arrivals.length > 0 && isLookingElsewhere) {
          setHeldIds(
            (held) => new Set([...held, ...arrivals.map((doc) => doc.id)]),
          );
        }

        setHasMore(isWindowFull);
        // Each new upload pushes the oldest post out of the query's window.
        // Keep the ones already on screen so the bottom of the gallery does
        // not disappear while someone is looking at it.
        setItems((shown) =>
          isWindowFull && last
            ? [
                ...fresh,
                ...shown.filter(
                  (item) => !freshIds.has(item.id) && isAtOrAfter(item, last),
                ),
              ]
            : fresh,
        );
        setLoadedPage(page);
        setFetchError(false);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        console.error("Error fetching gallery:", error);
        setFetchError(true);
        setIsLoading(false);
      },
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [slug, page, day, firstDay]);

  const visible =
    heldIds.size === 0 ? items : items.filter((item) => !heldIds.has(item.id));
  const heldCount = items.length - visible.length;

  // A different column count is a different wall, so it is dealt afresh.
  if (layout.current.count !== columnCount) {
    layout.current = { count: columnCount, placed: new Map() };
  }
  const columns = dealIntoColumns(
    visible,
    columnCount,
    layout.current.placed,
    ratios.current,
  );

  const showHeld = () => {
    setHeldIds(new Set());
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const canLoadMore = hasMore && loadedPage === page;
  const loadMore = useCallback(() => {
    if (canLoadMore) setPage(page + 1);
  }, [canLoadMore, page]);

  // Load the next page as the bottom of the gallery comes near. Re-observing
  // after every page means a short page that leaves it in view loads again.
  const loaderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !canLoadMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && loadMore(),
      { rootMargin: "800px 0px" },
    );
    observer.observe(loader);
    return () => observer.disconnect();
  }, [canLoadMore, loadMore]);

  // The viewer pages through the whole tab, so fetch ahead of its last photo.
  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= visible.length - 5) {
      loadMore();
    }
  }, [selectedIndex, visible.length, loadMore]);

  const closeViewer = useCallback(() => setSelectedIndex(null), []);
  const navigate = useCallback(
    (delta: -1 | 1) =>
      setSelectedIndex((current) => {
        if (current === null || visible.length === 0) return current;
        const next = current + delta;
        // Wait at the last loaded photo while more are on the way.
        if (next >= visible.length && hasMore) return current;
        return (next + visible.length) % visible.length;
      }),
    [visible.length, hasMore],
  );

  const pickDay = (next: string | null) => {
    // Re-tapping the current tab must not clear a gallery that will not reload.
    if (next === day) return;
    setDay(next);
    setPage(1);
    setLoadedPage(0);
    setTotal(0);
    setIsLoading(true);
    setItems([]);
    setHeldIds(new Set());
    knownIds.current = new Set();
    layout.current = { count: columnCount, placed: new Map() };
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
      <div
        className="bg-cover bg-center"
        style={
          account.coverImage
            ? { backgroundImage: `url(${account.coverImage})` }
            : undefined
        }
      >
        <section
          className={`relative mx-auto flex min-h-[100svh] max-w-md flex-col items-center justify-center px-8 pt-12 text-center ${
            account.showUpload ? "pb-48" : "pb-12"
          }`}
        >
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
                onClick={post(() => openPicker(CAMERA_INPUT_ID))}
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

          {account.showUpload && (
            // A whiteboard-style scribble pointing at the round camera button
            // in the bar below; it scrolls away with the cover.
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-[6.6rem] flex flex-col items-center"
            >
              <span className="-rotate-3 whitespace-nowrap font-hand text-[1.9rem] leading-none">
                take a photo now!
              </span>
              <svg
                viewBox="0 0 40 52"
                className="mt-1 h-12 w-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 4C8 18 25 26 20 46" />
                <path d="M10 35L20 48L31 37" />
              </svg>
            </div>
          )}
        </section>
      </div>

      {/* The gallery */}
      <section
        ref={galleryRef}
        aria-label="Gallery"
        className="mx-auto min-h-[100svh] max-w-3xl pb-16"
      >
        {account.eventDays && (
          <nav
            aria-label="Filter by day"
            className="sticky top-0 z-30 flex justify-between border-b border-[color:var(--line)] bg-[var(--paper)] px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:justify-center sm:gap-8"
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

        {heldCount > 0 && (
          // Zero height, so showing the button moves nothing underneath it.
          <div className="pointer-events-none sticky top-[calc(env(safe-area-inset-top)+4rem)] z-20 flex h-0 justify-center">
            <button
              type="button"
              onClick={showHeld}
              className={`${label} pointer-events-auto h-11 rounded-full bg-[var(--ink)] px-6 text-[color:var(--paper)] shadow-lg transition-transform active:scale-[0.98]`}
            >
              {heldCount} new {heldCount === 1 ? "post" : "posts"}
            </button>
          </div>
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

          <div className="flex items-start gap-2">
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="flex min-w-0 flex-1 flex-col gap-2"
              >
                {column.map(({ item, index }) => {
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
                      className="relative block w-full overflow-hidden rounded-sm bg-[var(--line)]"
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
                          onLoad={({ currentTarget: image }) => {
                            if (image.naturalWidth > 0) {
                              ratios.current.set(
                                item.id,
                                image.naturalHeight / image.naturalWidth,
                              );
                            }
                          }}
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
            ))}
          </div>

          {hasMore && items.length > 0 && (
            <div
              ref={loaderRef}
              role="status"
              className="flex justify-center pt-8"
            >
              <span
                aria-hidden="true"
                className="h-7 w-7 animate-spin rounded-full border-2 border-[color:var(--line)] border-t-[color:var(--ink)]"
              />
              <span className="sr-only">Loading more photos</span>
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
                onClick={post(() => setIsSheetOpen(true))}
                className={`${label} h-full`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={post(() => openPicker(CAMERA_INPUT_ID))}
                aria-label="Take a photo"
                className="mx-auto -mt-8 h-[4.25rem] w-[4.25rem] rounded-full border border-[color:var(--ink)] bg-[var(--paper)] p-1.5 transition-transform active:scale-95"
              >
                <span className="block h-full w-full rounded-full bg-[var(--ink)]" />
              </button>
              <button
                type="button"
                onClick={post(() => openPicker(VIDEO_INPUT_ID))}
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
            onShabbat={() => setShowShabbatNotice(true)}
            slug={slug}
            account={account}
          />
        </>
      )}

      {showShabbatNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6"
          onClick={() => setShowShabbatNotice(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shabbat-notice-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-[var(--paper)] px-8 py-9 text-center shadow-2xl"
          >
            <h2 id="shabbat-notice-title" className="text-3xl italic">
              Shabbat Shalom
            </h2>
            <p className="mt-4 text-lg opacity-70">
              Posting is paused for Shabbat. You are welcome to look through the
              gallery, and you can share your photos and videos again on
              Saturday night.
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => setShowShabbatNotice(false)}
              className={`${pill} ${label} mt-7 border-[color:var(--ink)] bg-[var(--ink)] text-[color:var(--paper)]`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {selectedIndex !== null && (
        <Lightbox
          items={visible}
          total={Math.max(total - heldCount, visible.length)}
          index={selectedIndex}
          onClose={closeViewer}
          onNavigate={navigate}
        />
      )}
    </main>
  );
}
