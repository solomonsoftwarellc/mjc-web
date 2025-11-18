import Link from "next/link";
import { Accounts } from "./accounts";
import Image from "next/image";

export default function WeddingPage() {
  const weddings = Object.values(Accounts).filter(
    (account) => (account as { displayWedding?: boolean }).displayWedding,
  );

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 pb-16 pt-24 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Community Weddings
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {weddings.map((wedding) => (
            <Link
              key={wedding.slug}
              className="flex max-w-xs flex-col rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href={`/wedding/signup/${wedding.slug}`}
            >
              <Image
                src={`/wedding/${wedding.slug}.png`}
                alt={`${wedding.name} wedding banner`}
                width={300}
                height={100}
                className="rounded-lg object-cover"
              />
              <div className="mt-auto pt-4 text-center">
                <h3 className="text-2xl font-bold">{wedding.name} →</h3>
                <div className="text-lg">{wedding.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
