import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Caveat, EB_Garamond, Inter, Pinyon_Script } from "next/font/google";
import GoogleAnalytics from "~/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const serif = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

// Only the wedding covers use this, for the couple's names.
const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-script",
  preload: false,
});

// Handwriting for the "take a photo now" nudge on wedding covers.
const hand = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand",
  preload: false,
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
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serif.variable} ${script.variable} ${hand.variable}`}
    >
      <body className="bg-background font-serif text-foreground antialiased">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
