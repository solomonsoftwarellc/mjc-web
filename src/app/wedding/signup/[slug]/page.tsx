import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAccount, weddingSlugs } from "../../accounts";
import WeddingGallery from "./_components/WeddingGallery/WeddingGallery";

export function generateStaticParams() {
  return weddingSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const account = getAccount(params.slug);
  const title = account?.name ?? "Wedding Gallery";
  const description = account
    ? `Share your memories from ${account.name}`
    : "Share your wedding memories";
  const banner = `/wedding/${params.slug}.png`;

  return {
    // The couple's name stands on its own - no "| MJC" suffix here.
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images: [banner],
      url: `/wedding/signup/${params.slug}`,
      type: "website",
    },
    icons: { icon: banner },
  };
}

export default function SignupSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const account = getAccount(params.slug);

  if (!account) {
    notFound();
  }

  return (
    <main
      className="flex min-h-screen flex-col items-start"
      style={{ color: account.textColor, background: account.backgroundColor }}
    >
      <div className="flex h-12 w-full flex-row items-center justify-start px-4 pt-4">
        <Link
          className="rounded-xl bg-black/5 px-4 py-3 text-2xl font-bold transition-colors hover:bg-black/10"
          href="/wedding"
          style={{ color: account.textColor }}
        >
          Home
        </Link>
      </div>

      <div className="container mx-auto flex flex-col gap-12 px-4 py-8">
        <header className="flex flex-col items-center justify-center space-y-4">
          <Image
            src={`/wedding/${params.slug}.png`}
            alt={`${account.name} banner`}
            width={800}
            height={200}
            sizes="(max-width: 640px) 60vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
            className="w-[60%] object-contain transition-all duration-300 sm:w-[40%] md:w-[30%] lg:w-[20%]"
            priority
          />
          <h1 className="text-center text-2xl font-bold tracking-tight">
            {account.name}
          </h1>
          <p className="text-center font-['Times_New_Roman'] text-lg">
            {account.date}
          </p>
        </header>

        <WeddingGallery slug={params.slug} account={account} />
      </div>
    </main>
  );
}
