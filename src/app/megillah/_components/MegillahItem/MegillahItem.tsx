import Image from "next/image";
import type { Megillah } from "types";

type MegillahItemProps = {
  megillah: Megillah & { thumbnailUrl?: string | null };
  priority?: boolean;
};

export default function MegillahItem({
  megillah,
  priority = false,
}: MegillahItemProps) {
  const date = megillah.releaseDate ? new Date(megillah.releaseDate) : null;

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date recorded";

  const title = `Issue #${megillah.issue} - ${formattedDate}`;

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="aspect-ratio-box">
        <div className="aspect-ratio-box-inner">
          {megillah.thumbnailUrl ? (
            <Image
              src={megillah.thumbnailUrl}
              alt={`Cover of issue ${megillah.issue}`}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 22vw"
              priority={priority}
              className="object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-white/30 text-center text-sm text-white/60">
              No cover
            </div>
          )}
        </div>
      </div>
      <span className="text-center">{title}</span>
    </div>
  );
}
