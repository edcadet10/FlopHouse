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
  // Add cache busting for better cache control
  generateBuildId: async () => {
    // Use timestamp to ensure unique build IDs
    return `build-${Date.now()}`
  },
  // Don't use exportPathMap with App Router
  // Instead, we're using generateStaticParams in page components
}

module.exports = nextConfig
