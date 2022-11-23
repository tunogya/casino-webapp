/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    INFURA_KEY: process.env.INFURA_KEY,
    NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS,
    BOT_TOKEN: process.env.BOT_TOKEN
  }
};

module.exports = nextConfig;
