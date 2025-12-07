/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark these packages as external to avoid bundling issues
      config.externals.push('@libsql/client', '@libsql/isomorphic-ws')
    }
    return config
  },
}

module.exports = nextConfig
