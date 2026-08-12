import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// The production domain, not VERCEL_URL - that resolves to the immutable
// per-deployment host, which then shows up in every shared link preview.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mashadi.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MJC",
    template: "%s | MJC",
  },
  description: "Mashadi Jewish Community",
  icons: [{ rel: "icon", url: "/favicon.png" }],
  openGraph: {
    siteName: "MJC",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#15162c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
