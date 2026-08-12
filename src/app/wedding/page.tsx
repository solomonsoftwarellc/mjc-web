import Link from "next/link";
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
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center gap-12 px-4 pb-16 pt-12">
        <div className="flex w-full">
          <Link
            className="rounded-xl bg-white/10 px-4 py-3 text-lg font-bold transition-colors hover:bg-white/20"
            href="/"
          >
            ← Home
          </Link>
        </div>

        <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Community Weddings
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {displayedWeddings.map((wedding, index) => (
            <Link
              key={wedding.slug}
              className="flex max-w-xs flex-col rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/20"
              href={`/wedding/signup/${wedding.slug}`}
            >
              {/* The banners are transparent PNGs of dark ink, so they need a
                  light backdrop to be legible over the purple gradient. Using
                  each wedding's own palette makes the card a preview of the
                  gallery it links to. */}
              <div
                className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg p-3"
                style={{ background: wedding.backgroundColor }}
              >
                <Image
                  src={`/wedding/${wedding.slug}.png`}
                  alt={`${wedding.name} banner`}
                  width={300}
                  height={200}
                  sizes="(max-width: 640px) 90vw, 300px"
                  priority={index < 3}
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="mt-auto pt-4 text-center">
                <h2 className="text-2xl font-bold">{wedding.name} →</h2>
                <p className="text-lg">{wedding.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
