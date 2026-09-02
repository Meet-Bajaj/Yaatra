import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.56.1" , "pm88z5-ip-122-168-7-13.tunnelmole.net"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "pm88z5-ip-122-168-7-13.tunnelmole.net",
      },

    ],
  },
};

export default nextConfig;
