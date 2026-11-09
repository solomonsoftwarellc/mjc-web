import Link from "next/link";
import SiteShell, { PageTitle } from "~/components/SiteShell";
import Image from "next/image";
import type { Metadata } from "next";
import { displayedWeddings } from "./accounts";

export const metadata: Metadata = {
  title: "Community Weddings",
  description:
    "Photo and video galleries from weddings of the United Mashadi Jewish Community of America.",
};

export default function WeddingPage() {
  return (
    <SiteShell>
      <PageTitle eyebrow="Our community" title="Weddings">
        Photographs and films from the celebrations of our community.
      </PageTitle>

      <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {displayedWeddings.map((wedding, index) => (
          <Link
            key={wedding.slug}
            href={`/wedding/signup/${wedding.slug}`}
            className="group block text-center"
          >
            {/* Each card sits on that wedding's own paper colour, so it
                previews the page it opens. */}
            <div
              className="flex aspect-[4/3] items-center justify-center rounded-sm p-10 ring-1 ring-border transition-shadow duration-300 group-hover:shadow-[0_18px_36px_-18px_rgba(20,35,59,0.4)]"
              style={{ background: wedding.backgroundColor }}
            >
              <Image
                src={`/wedding/${wedding.slug}.png`}
                alt=""
                width={300}
                height={200}
                sizes="(max-width: 640px) 70vw, 260px"
                priority={index < 3}
                className="h-full w-auto max-w-full object-contain"
              />
            </div>
            <h2 className="mt-6 text-3xl">{wedding.couple}</h2>
            <p className="eyebrow mt-2 text-muted-foreground">
              {wedding.dateLabel ?? wedding.date}
            </p>
          </Link>
        ))}
      </div>
    </SiteShell>
  );
}
