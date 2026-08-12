"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_UPLOAD_API ?? "https://mashadi.phantomcheckerapi.com";

/** Photos are small; several at once saturates a phone's uplink nicely. */
const IMAGE_CONCURRENCY = 4;
/** Videos are large; more than two in flight just makes them all slower. */
const VIDEO_CONCURRENCY = 2;
/** Cloudflare requires tus chunks divisible by 256 KiB. */
const TUS_CHUNK_BYTES = 16 * 1024 * 1024;
const MAX_ATTEMPTS = 3;
const PREPARE_BATCH = 50;

export type UploadStatus =
  | "queued"
  | "uploading"
  | "processing"
  | "done"
  | "error";

export type UploadItem = {
  id: string;
  file: File;
  kind: "image" | "video";
  status: UploadStatus;
  /** 0..1 */
  progress: number;
  attempts: number;
  error?: string;
  previewUrl?: string;
  pendingId?: string;
  assetId?: string;
  uploadURL?: string;
  protocol?: "form" | "tus";
};

export type QueueSummary = {
  total: number;
  done: number;
  failed: number;
  inFlight: number;
  /** 0..1 weighted by file size, so one big video doesn't jump the bar. */
  overallProgress: number;
  bytesTotal: number;
  bytesSent: number;
  isRunning: boolean;
};

let counter = 0;
const nextId = () => `u${Date.now().toString(36)}-${counter++}`;

/**
 * POST JSON to our API without tripping a CORS preflight.
 *
 * `text/plain` keeps the request "simple", so the browser skips OPTIONS. That
 * matters because the API hostname sits behind Cloudflare bot protection, which
 * challenges OPTIONS - and a preflight can never solve a challenge, so the
 * request dies before reaching the server. The server parses the text as JSON.
 *
 * Also bounded by a timeout: without one a hung request leaves every row
 * sitting on "Waiting" forever with no way to tell something went wrong.
 */
async function postJson(url: string, payload: unknown, timeoutMs = 45000) {
  // AbortSignal.timeout is unavailable on older phone browsers; going without
  // it is better than throwing on the very devices we are trying to support.
  const signal =
    typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
      ? AbortSignal.timeout(timeoutMs)
      : undefined;

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(payload),
    signal,
  });
}

function classify(file: File): "image" | "video" | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  // Phones sometimes hand over an empty MIME type for .mov/.heic.
  if (/\.(mov|mp4|m4v|avi|mkv|webm)$/i.test(file.name)) return "video";
  if (/\.(jpe?g|png|gif|heic|heif|webp)$/i.test(file.name)) return "image";
  return null;
}

/** Upload one image with XHR so we get real progress events. */
function putImage(
  file: File,
  url: string,
  onProgress: (fraction: number) => void,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file, file.name);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Cloudflare responded ${xhr.status}`));
    });
    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.addEventListener("abort", () => reject(new Error("Cancelled")));
    signal.addEventListener("abort", () => xhr.abort(), { once: true });

    xhr.open("POST", url);
    xhr.send(form);
  });
}

/**
 * Upload one video over tus, which survives a dropped connection.
 *
 * The tus client is imported on demand so guests who only browse the gallery
 * never download it.
 */
async function putVideo(
  file: File,
  url: string,
  onProgress: (fraction: number) => void,
  signal: AbortSignal,
): Promise<void> {
  const tus = await import("tus-js-client");

  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      uploadUrl: url,
      chunkSize: TUS_CHUNK_BYTES,
      // tus-js-client retries these internally before surfacing an error.
      retryDelays: [0, 3000, 6000, 12000, 24000],
      metadata: { filename: file.name, filetype: file.type },
      onProgress: (sent, total) => onProgress(total ? sent / total : 0),
      onSuccess: () => resolve(),
      onError: (error) => reject(error),
    });

    signal.addEventListener(
      "abort",
      () => {
        void upload.abort();
        reject(new Error("Cancelled"));
      },
      { once: true },
    );

    upload.start();
  });
}

export function useUploadQueue(slug: string) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  // Progress fires far faster than React should re-render; batch it.
  const progressRef = useRef(new Map<string, number>());
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (flushTimer.current) clearTimeout(flushTimer.current);
    };
  }, []);

  const patch = useCallback((id: string, changes: Partial<UploadItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }, []);

  const reportProgress = useCallback((id: string, fraction: number) => {
    progressRef.current.set(id, fraction);
    if (flushTimer.current) return;
    flushTimer.current = setTimeout(() => {
      flushTimer.current = null;
      const snapshot = new Map(progressRef.current);
      setItems((current) =>
        current.map((item) =>
          snapshot.has(item.id)
            ? { ...item, progress: snapshot.get(item.id)! }
            : item,
        ),
      );
    }, 200);
  }, []);

  const addFiles = useCallback((files: File[]) => {
    const added: UploadItem[] = [];
    for (const file of files) {
      const kind = classify(file);
      if (!kind) continue;
      added.push({
        id: nextId(),
        file,
        kind,
        status: "queued",
        progress: 0,
        attempts: 0,
        previewUrl: kind === "image" ? URL.createObjectURL(file) : undefined,
      });
    }
    setItems((current) => [...current, ...added]);
    return added.length;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => {
      const target = current.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((i) => i.id !== id);
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setItems((current) => {
      current
        .filter((i) => i.status === "done" && i.previewUrl)
        .forEach((i) => URL.revokeObjectURL(i.previewUrl!));
      return current.filter((i) => i.status !== "done");
    });
  }, []);

  /**
   * Upload everything not already done.
   *
   * Reserves upload slots in batches, then runs images and videos through
   * separate pools so a large video never blocks the photos behind it.
   */
  const start = useCallback(
    async (uploaderName: string) => {
      const pending = items.filter(
        (i) => i.status === "queued" || i.status === "error",
      );
      if (pending.length === 0) return;

      const controller = new AbortController();
      abortRef.current = controller;
      setIsRunning(true);

      // Keep the screen awake; a locked phone suspends uploads.
      let wakeLock: WakeLockSentinel | null = null;
      try {
        wakeLock = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        /* not supported, or denied - not fatal */
      }

      const finalizeQueue: { clientId: string; pendingId: string }[] = [];
      const flushFinalize = async (force = false) => {
        if (finalizeQueue.length === 0) return;
        if (!force && finalizeQueue.length < 10) return;
        const batch = finalizeQueue.splice(0, finalizeQueue.length);
        try {
          const response = await postJson(`${API}/uploads/finalize`, {
            slug,
            items: batch,
          });
          const body = (await response.json()) as {
            results?: { clientId: string; status: string }[];
          };
          body.results?.forEach((result) => {
            patch(result.clientId, {
              status: result.status === "published" || result.status === "already-done"
                ? "done"
                : "processing",
            });
          });
        } catch {
          // Not fatal: the bytes are on Cloudflare, and reconcile publishes
          // anything a client never confirmed.
          batch.forEach((b) => patch(b.clientId, { status: "processing" }));
        }
      };

      try {
        for (let i = 0; i < pending.length; i += PREPARE_BATCH) {
          if (controller.signal.aborted) break;
          const slice = pending.slice(i, i + PREPARE_BATCH);

          const response = await postJson(`${API}/uploads/prepare`, {
            slug,
            name: uploaderName,
            files: slice.map((item) => ({
              clientId: item.id,
              kind: item.kind,
              fileName: item.file.name,
              size: item.file.size,
              timestamp: new Date(item.file.lastModified).toISOString(),
            })),
          });

          if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as {
              error?: string;
            };
            const message = body.error ?? `Server responded ${response.status}`;
            slice.forEach((item) =>
              patch(item.id, { status: "error", error: message }),
            );
            continue;
          }

          const body = (await response.json()) as {
            items: {
              clientId: string;
              pendingId: string;
              assetId: string;
              protocol: "form" | "tus";
              uploadURL: string;
            }[];
            failed?: { clientId: string; error: string }[];
          };

          body.failed?.forEach((f) =>
            patch(f.clientId, { status: "error", error: f.error }),
          );

          const reserved = body.items
            .map((reservation) => {
              const item = slice.find((s) => s.id === reservation.clientId);
              return item ? { item, reservation } : null;
            })
            .filter(Boolean) as {
            item: UploadItem;
            reservation: (typeof body.items)[number];
          }[];

          reserved.forEach(({ item, reservation }) =>
            patch(item.id, {
              status: "uploading",
              progress: 0,
              error: undefined,
              pendingId: reservation.pendingId,
              assetId: reservation.assetId,
            }),
          );

          const runOne = async ({
            item,
            reservation,
          }: (typeof reserved)[number]) => {
            for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
              if (controller.signal.aborted) return;
              try {
                if (reservation.protocol === "tus") {
                  await putVideo(
                    item.file,
                    reservation.uploadURL,
                    (f) => reportProgress(item.id, f),
                    controller.signal,
                  );
                } else {
                  await putImage(
                    item.file,
                    reservation.uploadURL,
                    (f) => reportProgress(item.id, f),
                    controller.signal,
                  );
                }
                patch(item.id, { status: "processing", progress: 1 });
                finalizeQueue.push({
                  clientId: item.id,
                  pendingId: reservation.pendingId,
                });
                void flushFinalize();
                return;
              } catch (error) {
                if (controller.signal.aborted) return;
                const message =
                  error instanceof Error ? error.message : "Upload failed";
                if (attempt === MAX_ATTEMPTS) {
                  patch(item.id, {
                    status: "error",
                    error: message,
                    attempts: attempt,
                  });
                  return;
                }
                patch(item.id, { attempts: attempt });
                await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
              }
            }
          };

          const pool = async (
            jobs: typeof reserved,
            limit: number,
          ): Promise<void> => {
            let cursor = 0;
            const workers = Array.from(
              { length: Math.min(limit, jobs.length) },
              async () => {
                while (cursor < jobs.length) {
                  await runOne(jobs[cursor++]!);
                }
              },
            );
            await Promise.all(workers);
          };

          await Promise.all([
            pool(
              reserved.filter((r) => r.item.kind === "image"),
              IMAGE_CONCURRENCY,
            ),
            pool(
              reserved.filter((r) => r.item.kind === "video"),
              VIDEO_CONCURRENCY,
            ),
          ]);
        }

        await flushFinalize(true);
      } catch (error) {
        // Without this the rejection escapes and every row sits at "uploading"
        // forever while the summary cheerfully reports nothing failed.
        const message =
          error instanceof Error ? error.message : "Upload failed";
        const isTimeout =
          error instanceof DOMException && error.name === "TimeoutError";
        const reason =
          isTimeout || message.includes("timed out")
            ? "The upload server took too long to respond. Tap retry."
            : message === "Failed to fetch"
              ? "Could not reach the upload server. Check your connection."
              : message;

        setItems((current) =>
          current.map((item) =>
            item.status === "uploading" ||
            item.status === "queued" ||
            item.status === "processing"
              ? { ...item, status: "error", error: reason }
              : item,
          ),
        );
      } finally {
        await wakeLock?.release().catch(() => undefined);
        setIsRunning(false);
        abortRef.current = null;
      }
    },
    [items, slug, patch, reportProgress],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsRunning(false);
  }, []);

  const bytesTotal = items.reduce((sum, i) => sum + i.file.size, 0);
  const bytesSent = items.reduce(
    (sum, i) => sum + i.file.size * (i.status === "done" ? 1 : i.progress),
    0,
  );

  const summary: QueueSummary = {
    total: items.length,
    done: items.filter((i) => i.status === "done").length,
    failed: items.filter((i) => i.status === "error").length,
    inFlight: items.filter(
      (i) => i.status === "uploading" || i.status === "processing",
    ).length,
    overallProgress: bytesTotal ? bytesSent / bytesTotal : 0,
    bytesTotal,
    bytesSent,
    isRunning,
  };

  return {
    items,
    summary,
    addFiles,
    removeItem,
    clearCompleted,
    start,
    cancel,
  };
}
