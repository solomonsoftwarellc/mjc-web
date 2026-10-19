import Script from "next/script";

// GA4 Measurement ID for mashadi.io. Public by design (it ships in page HTML).
const GA_MEASUREMENT_ID = "G-JJ83C8H2D8";

/**
 * Loads Google Analytics on the live site only, so Vercel preview builds
 * and local dev don't inflate the numbers.
 */
export default function GoogleAnalytics() {
  if (process.env.VERCEL_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
