/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // Allow images from Unsplash
  },
  experimental: {
    // This will allow SWC to work with custom babel config
    forceSwcTransforms: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Node.js specific modules
    if (!isServer) {
      // When on the browser, provide empty implementations for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        'google-gax': false,
        grpc: false,
        '@grpc/proto-loader': false,
        '@grpc/grpc-js': false,
      };
      
      // Add aliases for Node.js modules to use our custom implementations
      config.resolve.alias = {
        ...config.resolve.alias,
        fs: require.resolve('./lib/module-resolver'),
        path: require.resolve('./lib/module-resolver'),
        os: require.resolve('./lib/module-resolver'),
        crypto: require.resolve('./lib/module-resolver'),
        '@grpc/proto-loader': require.resolve('./lib/module-resolver'),
        '@grpc/grpc-js': require.resolve('./lib/module-resolver'),
        'google-gax': require.resolve('./lib/module-resolver'),
        grpc: require.resolve('./lib/module-resolver'),
      };
    }

    // Handle server-only modules
    if (Array.isArray(config.externals)) {
      config.externals = [...config.externals, 'stripe', 'mysql2', 'jsonwebtoken', 'bcryptjs'];
    } else {
      config.externals = ['stripe', 'mysql2', 'jsonwebtoken', 'bcryptjs'];
    }

    return config;
  }
}

module.exports = nextConfig 