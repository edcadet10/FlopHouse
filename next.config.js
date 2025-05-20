/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // This ensures Next.js generates static HTML files
  output: 'export',
  // Enable trailing slashes for static export compatibility
  trailingSlash: false, // Changed to false for cleaner URLs
  // Ensure the public directory is properly copied
  distDir: 'out',
  // Don't use exportPathMap with App Router
  // Instead, we're using generateStaticParams in page components
}

module.exports = nextConfig
