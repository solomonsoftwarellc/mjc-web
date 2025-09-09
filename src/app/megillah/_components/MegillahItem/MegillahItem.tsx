import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../../../firebaseConfig";
import { Skeleton } from "~/components/ui/skeleton";
import type { Megillah } from "types";

function MegillahItem({ megillah }: { megillah: Megillah }) {
  const [imageUrl, setImageUrl] = useState<string>("/thumbnails/default.png");
  const [loading, setLoading] = useState(true);

  const date = megillah.releaseDate ? new Date(megillah.releaseDate) : null;

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date recorded";

  const title = `Issue #${megillah.issue} - ${formattedDate}`;

  useEffect(() => {
    if (megillah.thumbnailPathOnFirebaseStorage) {
      const imageRef = ref(storage, megillah.thumbnailPathOnFirebaseStorage);
      console.log("imageRef", imageRef);
      getDownloadURL(imageRef)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [megillah.thumbnailPathOnFirebaseStorage]);

  return (
    <div key={megillah.id} className=" flex flex-col justify-center gap-4">
      <div className="aspect-ratio-box">
        <div className="aspect-ratio-box-inner">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Image
              src={imageUrl}
              layout="fill"
              objectFit="contain"
              alt={`Cover of ${megillah.issue}`}
              className={
                megillah.thumbnailPathOnFirebaseStorage
                  ? ""
                  : "transform rounded-xl border-2 border-dashed"
              }
            />
          )}
        </div>
      </div>
      <span className="text-center">{title}</span>
    </div>
  );
}

export default MegillahItem;
