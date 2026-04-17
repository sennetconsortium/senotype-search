/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone',
  outputFileTracingIncludes: {
    '/**': ['./node_modules/xac-loglevel/**'],
  },
};

export default nextConfig;
