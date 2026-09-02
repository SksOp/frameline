import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Next 16's CLI checker can lose `tsc --showConfig` stdout under Node 24.
  // TypeScript 6 still exposes the compiler API, so use Next's API checker
  // while retaining full production-build type validation.
  experimental: {
    useTypeScriptCli: false,
  },

  allowedDevOrigins: ['e4f1-223-235-103-87.ngrok-free.app'],
};

export default nextConfig;
