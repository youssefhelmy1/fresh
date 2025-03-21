// Polyfill Buffer for edge runtime
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof global !== 'undefined' && !global.Buffer) {
  global.Buffer = Buffer;
}

// Export an empty middleware since this file is just for the polyfills
export default function middleware() {}

export const config = {
  runtime: 'edge',
} 