import React from "react";
import Image from "next/image";

function MegillahItem({
  megillah,
}: {
  megillah: {
    id: number;
    issue: number;
    releaseDate: Date | null;
    thumbnailPath: string | null;
  };
}) {
  const date = megillah.releaseDate ? new Date(megillah.releaseDate) : null;

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date recorded";

  const title = `Issue #${megillah.issue} - ${formattedDate}`;

  const src = megillah.thumbnailPath
    ? `${megillah.thumbnailPath}.JPG`
    : "/thumbnails/default.png";

  return (
    <div key={megillah.id} className=" flex flex-col justify-center gap-4">
      <div className="aspect-ratio-box">
        <div className="aspect-ratio-box-inner">
          <Image
            src={src}
            layout="fill"
            objectFit="contain"
            alt={`Cover of ${megillah.issue}`}
            className={
              megillah.thumbnailPath
                ? ""
                : "transform rounded-xl border-2 border-dashed"
            }
          />
        </div>
      </div>
      <span className="text-center">{title}</span>
    </div>
  );
}

export default MegillahItem;
