/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/hospital-flow/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/hospital-flow' : '',
};

export default nextConfig; 