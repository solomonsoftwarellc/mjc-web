/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/news",
        destination: "https://kanissanews.com",
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Wedding banners and megillah covers are the only optimized images, and
    // none of them render wider than a single grid column.
    deviceSizes: [320, 480, 640, 828, 1080, 1200],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default config;
