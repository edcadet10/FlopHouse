/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Enable trailing slashes for static export compatibility
  trailingSlash: true,
  // This ensures Next.js generates static HTML files
  output: 'export'
}

module.exports = nextConfig
