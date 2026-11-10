import Image from "next/image";
import type { Megillah } from "types";

type MegillahItemProps = {
  megillah: Megillah & { thumbnailUrl?: string | null };
  priority?: boolean;
  /** The newest issue is shown larger, so it needs a larger image. */
  sizes?: string;
};

export default function MegillahItem({
  megillah,
  priority = false,
  sizes = "(max-width: 640px) 45vw, (max-width: 768px) 30vw, 22vw",
}: MegillahItemProps) {
  const date = megillah.releaseDate ? new Date(megillah.releaseDate) : null;

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date recorded";

  return (
    <div className="flex flex-col gap-4">
      {/* Shadowed like a magazine lying on the page. */}
      <div className="aspect-ratio-box overflow-hidden rounded-sm bg-card shadow-[0_14px_30px_-14px_rgba(13,34,79,0.45)] ring-1 ring-border transition-transform duration-300 group-hover:-translate-y-1">
        <div className="aspect-ratio-box-inner">
          {megillah.thumbnailUrl ? (
            <Image
              src={megillah.thumbnailUrl}
              alt={`Cover of issue ${megillah.issue}`}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center italic text-muted-foreground">
              No cover
            </div>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-xl">Issue {megillah.issue}</p>
        <p className="eyebrow mt-1 text-muted-foreground">{formattedDate}</p>
      </div>
    </div>
  );
}
