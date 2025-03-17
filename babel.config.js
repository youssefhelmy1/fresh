module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: 'react'
        }
      }
    ]
  ],
  plugins: [
    ['module-resolver', {
      root: ['.'],
      alias: {
        'fs': './lib/module-resolver',
        'path': './lib/module-resolver',
        'os': './lib/module-resolver',
        'crypto': './lib/module-resolver',
        '@grpc/proto-loader': './lib/module-resolver',
        '@grpc/grpc-js': './lib/module-resolver',
        'google-gax': './lib/module-resolver',
        'grpc': './lib/module-resolver',
      }
    }]
  ]
}; 