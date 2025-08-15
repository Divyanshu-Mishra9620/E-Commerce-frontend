import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "img5a.flixcart.com",
      },
      {
        protocol: "https",
        hostname: "i.imghippo.com",
      },
      {
        protocol: "https",
        hostname: "img5a.flixcart.com",
      },
      {
        protocol: "http",
        hostname: "img6a.flixcart.com",
      },
      {
        protocol: "https",
        hostname: "img6a.flixcart.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
    ],
  },
};
export default withBundleAnalyzer(nextConfig);
