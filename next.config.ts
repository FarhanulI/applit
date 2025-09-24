/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos", "firebasestorage.googleapis.com"], // add any external domains you need
  },
};

module.exports = nextConfig;
