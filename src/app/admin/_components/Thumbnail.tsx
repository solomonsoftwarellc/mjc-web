"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "firebaseConfig";

interface ThumbnailProps {
  path?: string | null;
  alt: string;
}

/** A small magazine-shaped cover; an empty frame until (or unless) it loads. */
export default function Thumbnail({ path, alt }: ThumbnailProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setUrl(null);
    if (!path) return;
    getDownloadURL(ref(storage, path))
      .then(setUrl)
      .catch((error) => console.error("Failed to fetch thumbnail URL:", error));
  }, [path]);

  return (
    <div className="relative h-20 w-[3.6rem] shrink-0 overflow-hidden rounded-sm bg-muted ring-1 ring-border">
      {url ? (
        <Image src={url} alt={alt} fill sizes="58px" className="object-cover" />
      ) : (
        <span className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
          {path ? "" : "No cover"}
        </span>
      )}
    </div>
  );
}
