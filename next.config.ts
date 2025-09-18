import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "profile.line-scdn.net",
      // เพิ่ม domain อื่นๆ ได้ที่นี่
    ],
  },
};

export default nextConfig;
