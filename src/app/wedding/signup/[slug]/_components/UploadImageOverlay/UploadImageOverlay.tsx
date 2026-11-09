"use client";

import React, { useEffect, useRef, useState } from "react";
import type { WeddingAccount } from "~/app/wedding/accounts";
import {
  useUploadQueue,
  type UploadItem,
} from "./useUploadQueue";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Called when files arrive from the camera while the sheet is closed. */
  onOpen?: () => void;
  slug: string;
  account: WeddingAccount;
};

/**
 * The capture inputs live here, next to the upload queue, but are triggered
 * from buttons elsewhere on the page (the cover, the bottom bar).
 */
export const CAMERA_INPUT_ID = "wedding-camera-photo";
export const VIDEO_INPUT_ID = "wedding-camera-video";
const LIBRARY_INPUT_ID = "wedding-media-library";

export const openPicker = (inputId: string) =>
  document.getElementById(inputId)?.click();

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const label = "text-[11px] font-semibold uppercase tracking-[0.28em]";

function StatusLabel({ item }: { item: UploadItem }) {
  switch (item.status) {
    case "queued":
      return <span className="opacity-60">Waiting</span>;
    case "uploading":
      return <span>{Math.round(item.progress * 100)}%</span>;
    case "processing":
      return <span className="opacity-70">Finishing</span>;
    case "done":
      return <span>Shared</span>;
    case "error":
      return (
        <span className="text-red-700" title={item.error}>
          Failed
        </span>
      );
  }
}

function Row({
  item,
  onRemove,
  disabled,
}: {
  item: UploadItem;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-[var(--line)]">
        {item.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.previewUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[9px] font-semibold uppercase tracking-widest opacity-70">
            Video
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-base" title={item.file.name}>
            {item.file.name}
          </p>
          <span className={`${label} shrink-0 tracking-[0.16em]`}>
            <StatusLabel item={item} />
          </span>
        </div>

        <div className="mt-1.5 h-px w-full bg-[var(--line)]">
          <div
            className="h-0.5 -translate-y-px transition-[width] duration-200"
            style={{
              width: `${(item.status === "done" ? 1 : item.progress) * 100}%`,
              background: item.status === "error" ? "#b91c1c" : "var(--ink)",
            }}
          />
        </div>

        <p className="mt-1 text-sm opacity-60">
          {formatBytes(item.file.size)}
          {item.status === "error" && item.error ? ` - ${item.error}` : ""}
        </p>
      </div>

      {!disabled && item.status !== "done" && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 px-2 py-1 text-2xl leading-none opacity-50 hover:opacity-100"
          aria-label={`Remove ${item.file.name}`}
        >
          ×
        </button>
      )}
    </li>
  );
}

export default function UploadModal({
  isOpen,
  onClose,
  onOpen,
  slug,
  account,
}: UploadModalProps) {
  const [name, setName] = useState("");
  /** `name` once the guest has stopped typing; drives the automatic start. */
  const [settledName, setSettledName] = useState("");
  const [nameError, setNameError] = useState(false);
  /** A remembered name collapses to "Sharing as ..." until the guest edits it. */
  const [isEditingName, setIsEditingName] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { items, summary, addFiles, removeItem, clearCompleted, start, cancel } =
    useUploadQueue(slug);

  useEffect(() => {
    const saved = localStorage.getItem("uploaderName");
    // A remembered name needs no settle delay - it is already complete.
    if (saved) {
      setName(saved);
      setSettledName(saved);
      setIsEditingName(false);
    }
  }, []);

  useEffect(() => {
    if (name.trim()) localStorage.setItem("uploaderName", name.trim());
  }, [name]);

  // Losing the tab mid-upload would strand files, so warn first.
  useEffect(() => {
    if (!summary.isRunning) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [summary.isRunning]);

  // Wait for typing to settle before treating the name as final. Reacting to
  // every keystroke would fire the upload on the first letter and stamp every
  // photo with "J" instead of "Jonathan".
  useEffect(() => {
    if (settledName === name) return;
    const timer = setTimeout(() => setSettledName(name), 900);
    return () => clearTimeout(timer);
  }, [name, settledName]);

  // Picking files is the whole interaction - uploading begins straight away.
  // This also covers the reverse order: pick files first, then type a name, and
  // it starts once the name settles. Only untouched "queued" items trigger it,
  // so a failed upload waits for an explicit retry.
  useEffect(() => {
    if (!settledName.trim() || summary.isRunning) return;
    if (!items.some((item) => item.status === "queued")) return;
    void start(settledName.trim());
  }, [items, settledName, summary.isRunning, start]);

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      addFiles(Array.from(event.target.files));
      // A shot from the camera lands here with the sheet closed; open it so
      // the guest sees it uploading (or is asked for their name).
      onOpen?.();
    }
    // Allow picking the same file again after removing it.
    event.target.value = "";
  };

  const pendingCount = items.filter(
    (i) => i.status === "queued" || i.status === "error",
  ).length;
  const needsName = !name.trim() && pendingCount > 0 && !summary.isRunning;

  const handleStart = () => {
    if (!name.trim()) {
      setNameError(true);
      setIsEditingName(true);
      inputRef.current?.focus();
      return;
    }
    setNameError(false);
    void start(name.trim());
  };

  const allDone =
    items.length > 0 && summary.done === items.length && !summary.isRunning;
  const button = `${label} flex-1 rounded-full border border-[color:var(--ink)] px-4 py-3.5 text-center`;

  return (
    <>
      {/* Always mounted so the camera works whether or not the sheet is open. */}
      <input
        id={CAMERA_INPUT_ID}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePick}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        id={VIDEO_INPUT_ID}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handlePick}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        id={LIBRARY_INPUT_ID}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handlePick}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45"
          onClick={summary.isRunning ? undefined : onClose}
          style={
            {
              "--ink": account.textColor,
              "--paper": account.backgroundColor,
              "--line": `color-mix(in srgb, ${account.textColor} 22%, transparent)`,
              fontFamily: "var(--font-serif), Georgia, serif",
            } as React.CSSProperties
          }
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Share a memory"
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[88dvh] w-full max-w-xl flex-col rounded-t-3xl bg-[var(--paper)] text-[color:var(--ink)] shadow-2xl"
          >
            <div className="relative px-6 pb-2 pt-3 text-center">
              <div
                className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--line)]"
                aria-hidden="true"
              />
              <h2 className="text-3xl italic">
                {allDone
                  ? `Thank you${name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}`
                  : "Share a memory"}
              </h2>
              <button
                type="button"
                onClick={summary.isRunning ? cancel : onClose}
                className="absolute right-3 top-4 px-3 py-1 text-3xl leading-none opacity-60"
                aria-label={summary.isRunning ? "Cancel uploads" : "Close"}
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {allDone ? (
                <p className="py-2 text-center text-lg opacity-70">
                  Your memories are in the album.
                </p>
              ) : !isEditingName && name.trim() ? (
                <p className="py-1 text-center text-lg">
                  <span className="opacity-70">Sharing as </span>
                  {name.trim()}
                  {!summary.isRunning && (
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="ml-2 underline decoration-[var(--line)] underline-offset-4 opacity-70"
                    >
                      change
                    </button>
                  )}
                </p>
              ) : (
                <div className="pt-1">
                  <label htmlFor="uploader-name" className={`${label} block opacity-70`}>
                    Your name
                  </label>
                  <input
                    ref={inputRef}
                    id="uploader-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (event.target.value.trim()) setNameError(false);
                    }}
                    // Leaving the field means they are done typing; no need to wait.
                    onBlur={(event) => {
                      setSettledName(event.target.value);
                      if (event.target.value.trim()) setIsEditingName(false);
                    }}
                    disabled={summary.isRunning}
                    placeholder="So we know who to thank"
                    className="mt-1 block w-full rounded-none border-0 border-b bg-transparent px-0 py-2 text-xl outline-none placeholder:italic placeholder:opacity-50 focus:border-[color:var(--ink)] disabled:opacity-60"
                    style={{
                      borderColor: nameError ? "#b91c1c" : "var(--line)",
                    }}
                  />
                  {nameError && (
                    <p className="mt-1 text-sm text-red-700">
                      Please enter your name so we know who to thank.
                    </p>
                  )}
                </div>
              )}

              {!allDone && (
                <>
                  <button
                    type="button"
                    onClick={() => openPicker(LIBRARY_INPUT_ID)}
                    disabled={summary.isRunning}
                    className="mt-5 block w-full rounded-lg border border-[color:var(--line)] px-6 py-7 text-center disabled:opacity-50"
                  >
                    <span className="block text-2xl">
                      Choose photos &amp; videos
                    </span>
                    <span className={`${label} mt-2 block opacity-60`}>
                      As many as you like
                    </span>
                  </button>

                  {!summary.isRunning && (
                    <div className="mt-4 flex justify-center gap-8">
                      <button
                        type="button"
                        onClick={() => openPicker(CAMERA_INPUT_ID)}
                        className={`${label} py-2`}
                      >
                        Take a photo
                      </button>
                      <button
                        type="button"
                        onClick={() => openPicker(VIDEO_INPUT_ID)}
                        className={`${label} py-2`}
                      >
                        Record a video
                      </button>
                    </div>
                  )}
                </>
              )}

              {items.length > 0 && (
                <ul className="mt-3 divide-y divide-[var(--line)]">
                  {items.map((item) => (
                    <Row
                      key={item.id}
                      item={item}
                      disabled={summary.isRunning}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[color:var(--line)] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                <div className="mb-2 flex items-baseline justify-between text-base">
                  <span>
                    {summary.done} of {summary.total} shared
                    {summary.failed > 0 && (
                      <span className="text-red-700"> · {summary.failed} failed</span>
                    )}
                  </span>
                  <span className="text-sm tabular-nums opacity-60">
                    {formatBytes(summary.bytesSent)} / {formatBytes(summary.bytesTotal)}
                  </span>
                </div>

                <div className="h-px w-full bg-[var(--line)]">
                  <div
                    className="h-0.5 -translate-y-px bg-[var(--ink)] transition-[width] duration-300"
                    style={{ width: `${summary.overallProgress * 100}%` }}
                  />
                </div>

                <div className="mt-4 flex gap-3">
                  {allDone ? (
                    <>
                      <button type="button" onClick={clearCompleted} className={button}>
                        Add more
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          clearCompleted();
                          onClose();
                        }}
                        className={`${button} bg-[var(--ink)] text-[color:var(--paper)]`}
                      >
                        Done
                      </button>
                    </>
                  ) : summary.isRunning || needsName || summary.failed > 0 ? (
                    // Nothing to press in the normal case - uploading is already
                    // under way. This only appears to cancel, to ask for a name,
                    // or to retry something that failed.
                    <button
                      type="button"
                      onClick={summary.isRunning ? cancel : handleStart}
                      className={`${button} ${
                        summary.isRunning ? "" : "bg-[var(--ink)] text-[color:var(--paper)]"
                      }`}
                    >
                      {summary.isRunning
                        ? "Cancel"
                        : needsName
                          ? "Enter your name to start"
                          : `Retry ${summary.failed} failed`}
                    </button>
                  ) : null}
                </div>

                {summary.isRunning && (
                  <p className="mt-3 text-center text-base italic opacity-60">
                    Keep this page open until it finishes.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
