"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "firebaseConfig";

interface ThumbnailProps {
  path?: string | null;
  alt: string;
}

export default function Thumbnail({ path, alt }: ThumbnailProps) {
  const [url, setUrl] = useState("/thumbnails/default.png");

  useEffect(() => {
    if (path) {
      const fetchUrl = async () => {
        try {
          const storageRef = ref(storage, path);
          const downloadUrl = await getDownloadURL(storageRef);
          setUrl(downloadUrl);
        } catch (error) {
          console.error("Failed to fetch thumbnail URL:", error);
          // Keep default image on error
        }
      };
      fetchUrl();
    }
  }, [path]);

  return (
    <Image
      src={url}
      alt={alt}
      width={50}
      height={50}
      className="h-12 w-12 object-cover"
    />
  );
}
