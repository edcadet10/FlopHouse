/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Enable trailing slashes for static export compatibility
  trailingSlash: true,
  // This ensures Next.js generates static HTML files
  output: 'export',
  // Ensure the public directory is properly copied
  distDir: 'out',
  // Configure dynamic routes for static export
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // Add an explicit index page for story/[id]
    return {
      ...defaultPathMap,
      '/story/[id]': { page: '/story/[id]' },
    };
  },
}

module.exports = nextConfig
