const path = require('path');

module.exports = {
  resolve: {
    fallback: {
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
    },
    alias: {
      fs: path.resolve(__dirname, './lib/module-resolver.js'),
      path: path.resolve(__dirname, './lib/module-resolver.js'),
      os: path.resolve(__dirname, './lib/module-resolver.js'),
      crypto: path.resolve(__dirname, './lib/module-resolver.js'),
      '@grpc/proto-loader': path.resolve(__dirname, './lib/module-resolver.js'),
      '@grpc/grpc-js': path.resolve(__dirname, './lib/module-resolver.js'),
      'google-gax': path.resolve(__dirname, './lib/module-resolver.js'),
      grpc: path.resolve(__dirname, './lib/module-resolver.js'),
    }
  }
}; 