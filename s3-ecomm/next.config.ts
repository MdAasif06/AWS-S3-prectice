import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[new URL(`https://d2rgd30snnj18q.cloudfront.net/**`)]
  }
};

export default nextConfig;
