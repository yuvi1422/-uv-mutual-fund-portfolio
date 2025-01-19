/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  output: "export",
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },
};

export default nextConfig;
