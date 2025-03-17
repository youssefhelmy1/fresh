// Type definitions for module-resolver.js

declare module 'fs' {
  export function readFileSync(path: string, options?: { encoding?: string; flag?: string } | string): string | Buffer;
  export function existsSync(path: string): boolean;
  export function readdirSync(path: string): string[];
  export function statSync(path: string): { isDirectory(): boolean; isFile(): boolean };
  export function writeFileSync(path: string, data: string | Buffer): void;
  export function mkdirSync(path: string): void;
  export const promises: {
    readFile(path: string, options?: { encoding?: string; flag?: string } | string): Promise<string | Buffer>;
    writeFile(path: string, data: string | Buffer): Promise<void>;
    mkdir(path: string): Promise<void>;
  };
}

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string): string;
  export function extname(path: string): string;
}

declare module 'os' {
  export function tmpdir(): string;
  export function homedir(): string;
  export function platform(): string;
  export const EOL: string;
}

declare module 'crypto' {
  export function randomBytes(size: number): { toString(encoding: string): string };
  export function createHash(algorithm: string): { update(data: string): { digest(encoding: string): string } };
  export function createHmac(algorithm: string, key: string): { update(data: string): { digest(encoding: string): string } };
}

declare module '@grpc/proto-loader' {
  export function loadSync(path: string, options?: any): any;
}

declare module '@grpc/grpc-js' {
  export const loadPackageDefinition: (packageDef: any) => any;
  export const credentials: {
    createInsecure(): any;
  };
}

declare module 'google-gax' {
  export const GoogleAuth: any;
  export const GrpcClient: any;
}

declare module 'grpc' {
  export function load(path: string): any;
  export function loadPackageDefinition(packageDef: any): any;
  export const credentials: {
    createInsecure(): any;
  };
} 