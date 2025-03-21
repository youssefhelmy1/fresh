/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // Allow images from Unsplash
  },
  // Specify the Netlify Edge runtime
  experimental: {
    runtime: 'edge',
  },
  webpack: (config, { isServer, nextRuntime }) => {
    if (!config.externals) {
      config.externals = [];
    }

    if (Array.isArray(config.externals)) {
      config.externals.push({
        stripe: 'stripe',
      });
    } else {
      config.externals = [{
        stripe: 'stripe',
      }];
    }

    // Add polyfills for edge functions and middleware
    if (nextRuntime === 'edge' || !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
      };
    }

    return config;
  }
}

module.exports = nextConfig