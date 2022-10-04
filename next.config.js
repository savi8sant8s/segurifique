// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createSecureHeaders } = require("next-secure-headers");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }];
  },
}

module.exports = nextConfig
