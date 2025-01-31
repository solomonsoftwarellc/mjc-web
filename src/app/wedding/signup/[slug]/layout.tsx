import { Metadata } from "next";
import { Accounts } from "../../accounts";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const account = Accounts[params.slug as keyof typeof Accounts];

  if (!account) {
    return {
      title: "Wedding Gallery",
      description: "Share your wedding memories",
      openGraph: {
        title: "Wedding Gallery",
        description: "Share your wedding memories",
        images: [`/wedding/signup/${params.slug}/wedding/${params.slug}.png`],
        url: `/wedding/signup/${params.slug}`,
        type: "website",
      },
      icons: {
        icon: `/wedding/${params.slug}.png`,
      },
    };
  }

  const metadata = {
    title: account.name,
    description: `Share your memories from ${account.name}`,
    openGraph: {
      title: account.name,
      description: `Share your memories from ${account.name}`,
      images: [`/wedding/signup/${params.slug}/wedding/${params.slug}.png`],
      url: `/wedding/signup/${params.slug}`,
      type: "website",
    },
    icons: {
      icon: `/wedding/${params.slug}.png`,
    },
  };

  return metadata;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
