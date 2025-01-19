import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: "Share Your Wedding Memories - Charlotte & David",
    description:
      "Upload and share your photos and videos from Charlotte and David's wedding celebration.",
    openGraph: {
      title: "Share Your Wedding Memories - Charlotte & David",
      description:
        "Upload and share your photos and videos from Charlotte and David's wedding celebration.",
      images: [`/wedding/signup/${params.slug}/wedding/${params.slug}.png`],
      url: `/wedding/signup/${params.slug}`,
      type: "website",
    },
    icons: {
      icon: `/wedding/${params.slug}.png`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
