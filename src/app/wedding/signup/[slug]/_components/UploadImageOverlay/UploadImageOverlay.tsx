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
  slug: string;
  account: WeddingAccount;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

function StatusLabel({ item }: { item: UploadItem }) {
  switch (item.status) {
    case "queued":
      return <span className="opacity-60">Waiting</span>;
    case "uploading":
      return <span>{Math.round(item.progress * 100)}%</span>;
    case "processing":
      return <span className="opacity-70">Finishing</span>;
    case "done":
      return <span className="font-medium">Uploaded</span>;
    case "error":
      return (
        <span className="text-red-600" title={item.error}>
          Failed
        </span>
      );
  }
}

function Row({
  item,
  accent,
  onRemove,
  disabled,
}: {
  item: UploadItem;
  accent: string;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <li className="flex items-center gap-3 py-2">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-black/10">
        {item.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.previewUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase opacity-60">
            Video
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm" title={item.file.name}>
            {item.file.name}
          </p>
          <span className="shrink-0 text-xs">
            <StatusLabel item={item} />
          </span>
        </div>

        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full transition-[width] duration-200"
            style={{
              width: `${(item.status === "done" ? 1 : item.progress) * 100}%`,
              background: item.status === "error" ? "#dc2626" : accent,
            }}
          />
        </div>

        <p className="mt-0.5 text-[11px] opacity-50">
          {formatBytes(item.file.size)}
          {item.status === "error" && item.error ? ` - ${item.error}` : ""}
        </p>
      </div>

      {!disabled && item.status !== "done" && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded px-2 py-1 text-lg leading-none opacity-50 hover:opacity-100"
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
  slug,
  account,
}: UploadModalProps) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { items, summary, addFiles, removeItem, clearCompleted, start, cancel } =
    useUploadQueue(slug);

  useEffect(() => {
    const saved = localStorage.getItem("uploaderName");
    if (saved) setName(saved);
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

  if (!isOpen) return null;

  const accent = account.textColor;
  const pendingCount = items.filter(
    (i) => i.status === "queued" || i.status === "error",
  ).length;

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) addFiles(Array.from(event.target.files));
    // Allow picking the same file again after removing it.
    event.target.value = "";
  };

  const handleStart = () => {
    if (!name.trim()) {
      setNameError(true);
      inputRef.current?.focus();
      return;
    }
    setNameError(false);
    void start(name.trim());
  };

  const allDone =
    items.length > 0 && summary.done === items.length && !summary.isRunning;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl shadow-xl"
        style={{ background: account.backgroundColor, color: accent }}
      >
        <div className="flex items-center justify-between border-b border-current/10 p-4">
          <h2 className="text-xl font-bold">Share your photos &amp; videos</h2>
          <button
            type="button"
            onClick={summary.isRunning ? cancel : onClose}
            className="rounded px-2 text-2xl leading-none"
            aria-label={summary.isRunning ? "Cancel uploads" : "Close"}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <label htmlFor="uploader-name" className="block text-sm font-medium">
            Your name
          </label>
          <input
            ref={inputRef}
            id="uploader-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (event.target.value.trim()) setNameError(false);
            }}
            disabled={summary.isRunning}
            placeholder="Enter your name"
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm outline-none focus:ring-2 disabled:opacity-60"
            style={{
              background: account.backgroundColor,
              borderColor: nameError ? "#dc2626" : accent,
              color: accent,
            }}
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-600">
              Please enter your name so we know who to thank.
            </p>
          )}

          <label
            htmlFor="media-upload"
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center ${
              summary.isRunning ? "pointer-events-none opacity-50" : ""
            }`}
            style={{ borderColor: accent }}
          >
            <span className="text-base font-medium">
              Tap to choose photos &amp; videos
            </span>
            <span className="mt-1 text-xs opacity-70">
              Select as many as you like - large videos are fine
            </span>
            <input
              id="media-upload"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handlePick}
              disabled={summary.isRunning}
              className="sr-only"
            />
          </label>

          {items.length > 0 && (
            <ul className="mt-4 divide-y divide-current/10">
              {items.map((item) => (
                <Row
                  key={item.id}
                  item={item}
                  accent={accent}
                  disabled={summary.isRunning}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-current/10 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>
                {summary.done} of {summary.total} uploaded
                {summary.failed > 0 && (
                  <span className="text-red-600"> · {summary.failed} failed</span>
                )}
              </span>
              <span className="tabular-nums opacity-70">
                {formatBytes(summary.bytesSent)} / {formatBytes(summary.bytesTotal)}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${summary.overallProgress * 100}%`,
                  background: accent,
                }}
              />
            </div>

            <div className="mt-3 flex gap-2">
              {allDone ? (
                <>
                  <button
                    type="button"
                    onClick={clearCompleted}
                    className="flex-1 rounded-lg border px-4 py-3 font-semibold"
                    style={{ borderColor: accent }}
                  >
                    Add more
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-lg px-4 py-3 font-semibold text-white"
                    style={{ background: accent }}
                  >
                    Done
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={summary.isRunning ? cancel : handleStart}
                  disabled={!summary.isRunning && pendingCount === 0}
                  className="w-full rounded-lg px-4 py-3 font-semibold text-white disabled:opacity-50"
                  style={{ background: accent }}
                >
                  {summary.isRunning
                    ? "Cancel"
                    : summary.failed > 0
                      ? `Retry ${summary.failed} failed`
                      : `Upload ${pendingCount} file${pendingCount === 1 ? "" : "s"}`}
                </button>
              )}
            </div>

            {summary.isRunning && (
              <p className="mt-2 text-center text-xs opacity-60">
                Keep this page open until it finishes.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
