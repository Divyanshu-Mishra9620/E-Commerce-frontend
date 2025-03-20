/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "img5a.flixcart.com",
      },
      {
        protocol: "http",
        hostname: "img6a.flixcart.com",
      },
    ],
  },
};

export default nextConfig;
