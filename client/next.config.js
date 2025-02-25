/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 2035795994,
    NEXT_PUBLIC_ZEGO_SERVER_SECRET: "7881020ba9d960ae68d6d4d483a2b3bb",
  },
  images: {
    domains: ["imgv3.fotor.com", "localhost", "res.cloudinary.com"],
  },
};

module.exports = nextConfig;
