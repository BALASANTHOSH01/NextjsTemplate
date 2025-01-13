/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      process.env.S3_BUCKET_NAME + '.s3.' + process.env.S3_REGION + '.amazonaws.com'
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

