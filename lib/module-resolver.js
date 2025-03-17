// This file provides empty implementations for Node.js modules that are not available in the browser

// Empty implementation for fs module
const fs = {
  readFileSync: () => '',
  existsSync: () => false,
  readdirSync: () => [],
  statSync: () => ({
    isDirectory: () => false,
    isFile: () => false
  }),
  writeFileSync: () => {},
  mkdirSync: () => {},
  promises: {
    readFile: async () => '',
    writeFile: async () => {},
    mkdir: async () => {}
  }
};

// Empty implementation for path module
const path = {
  join: (...args) => args.join('/'),
  resolve: (...args) => args.join('/'),
  dirname: (path) => path.split('/').slice(0, -1).join('/'),
  basename: (path) => path.split('/').pop(),
  extname: (path) => {
    const parts = path.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  }
};

// Empty implementation for os module
const os = {
  tmpdir: () => '/tmp',
  homedir: () => '/home/user',
  platform: () => 'browser',
  EOL: '\n'
};

// Empty implementation for crypto module
const crypto = {
  randomBytes: () => ({ toString: () => 'random' }),
  createHash: () => ({
    update: () => ({ digest: () => 'hash' })
  }),
  createHmac: () => ({
    update: () => ({ digest: () => 'hmac' })
  })
};

// Empty implementation for other Node.js modules
const grpc = {
  load: () => ({}),
  loadPackageDefinition: () => ({}),
  credentials: {
    createInsecure: () => ({})
  }
};

const protoLoader = {
  loadSync: () => ({})
};

// Handle both CommonJS and ES modules
if (typeof module !== 'undefined') {
  module.exports = {
    fs,
    path,
    os,
    crypto,
    grpc,
    protoLoader,
    // Add direct exports for submodules
    promises: fs.promises
  };
  
  // Add direct exports for CommonJS
  module.exports.readFileSync = fs.readFileSync;
  module.exports.existsSync = fs.existsSync;
  module.exports.readdirSync = fs.readdirSync;
  module.exports.statSync = fs.statSync;
  module.exports.writeFileSync = fs.writeFileSync;
  module.exports.mkdirSync = fs.mkdirSync;
  
  module.exports.join = path.join;
  module.exports.resolve = path.resolve;
  module.exports.dirname = path.dirname;
  module.exports.basename = path.basename;
  module.exports.extname = path.extname;
}

// ES module exports
export {
  fs,
  path,
  os,
  crypto,
  grpc,
  protoLoader
};

// Direct exports for ES modules
export const readFileSync = fs.readFileSync;
export const existsSync = fs.existsSync;
export const readdirSync = fs.readdirSync;
export const statSync = fs.statSync;
export const writeFileSync = fs.writeFileSync;
export const mkdirSync = fs.mkdirSync;
export const promises = fs.promises;

export const join = path.join;
export const resolve = path.resolve;
export const dirname = path.dirname;
export const basename = path.basename;
export const extname = path.extname;

export default {
  fs,
  path,
  os,
  crypto,
  grpc,
  protoLoader
}; 