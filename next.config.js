/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // Allow images from Unsplash
  },
  webpack: (config) => {
    if (!config.externals) {
      config.externals = [];
    }

    if (Array.isArray(config.externals)) {
      config.externals.push({
        stripe: 'stripe',
        mysql2: 'mysql2',
        jsonwebtoken: 'jsonwebtoken',
        bcryptjs: 'bcryptjs',
      });
    } else {
      config.externals = [{
        stripe: 'stripe',
        mysql2: 'mysql2',
        jsonwebtoken: 'jsonwebtoken',
        bcryptjs: 'bcryptjs',
      }];
    }

    return config;
  }
}

module.exports = nextConfig 