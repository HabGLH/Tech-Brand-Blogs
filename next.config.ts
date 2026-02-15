import type { NextConfig } from "next";

const configuredImageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTNAMES ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const externalImagePatterns = configuredImageHosts.flatMap((hostname) => [
  { protocol: "https" as const, hostname },
  { protocol: "http" as const, hostname },
]);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...externalImagePatterns,
    ],
  },
};

export default nextConfig;
