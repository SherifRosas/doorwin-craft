/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the dev server binds to all interfaces
  async headers() {
    return [];
  },
};

module.exports = nextConfig;





