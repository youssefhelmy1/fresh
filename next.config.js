/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // Allow images from Unsplash
  },
  webpack: (config, { isServer }) => {
    // Handle node modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        os: false,
        path: false,
        crypto: false,
      };
    }

    // Handle external modules
    if (!config.externals) {
      config.externals = [];
    }

    if (Array.isArray(config.externals)) {
      config.externals.push({
        stripe: 'stripe',
        mysql2: 'mysql2',
        jsonwebtoken: 'jsonwebtoken',
        bcryptjs: 'bcryptjs'
      });
    } else {
      config.externals = [{
        stripe: 'stripe',
        mysql2: 'mysql2',
        jsonwebtoken: 'jsonwebtoken',
        bcryptjs: 'bcryptjs'
      }];
    }

    return config;
  },
  experimental: {
    // Enable server components
    serverComponents: true,
    // Improve module resolution
    esmExternals: 'loose'
  }
}

module.exports = nextConfig 