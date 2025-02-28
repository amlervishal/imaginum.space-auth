/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Allow ENV variables to be passed to the client
  env: {
    NEXT_PUBLIC_WEBUI_URL: process.env.NEXT_PUBLIC_WEBUI_URL,
  },
}

module.exports = nextConfig
