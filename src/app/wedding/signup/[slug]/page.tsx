import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import { getAccount, weddingSlugs } from "../../accounts";
import Memories from "./_components/Memories/Memories";

export function generateStaticParams() {
  return weddingSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const account = getAccount(params.slug);
  if (!account) {
    return { title: "Wedding Gallery" };
  }

  const title = account.name;
  const date = account.dateLabel ?? account.date;
  const description = account.showUpload
    ? `${date} · Share your photos and videos from the celebration.`
    : `${date} · Photos and videos from the celebration.`;

  // A flattened 1200x630 card, not the transparent banner - messaging apps
  // composite transparency onto black. See scripts/generate-og-images.js.
  const card = `/wedding/og/${params.slug}.png`;
  const url = `/wedding/signup/${params.slug}`;

  return {
    // The couple's name stands on its own - no "| MJC" suffix here.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "MJC",
      images: [
        { url: card, width: 1200, height: 630, alt: `${account.name} monogram` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card],
    },
    icons: { icon: `/wedding/${params.slug}.png` },
  };
}

/** Tint the phone's browser chrome to match the wedding's paper colour. */
export function generateViewport({
  params,
}: {
  params: { slug: string };
}): Viewport {
  const account = getAccount(params.slug);
  return account ? { themeColor: account.backgroundColor } : {};
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

  return <Memories slug={params.slug} account={account} />;
}
