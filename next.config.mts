import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://hatha-yoga-marina.com/logo.png")],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors/warnings.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
