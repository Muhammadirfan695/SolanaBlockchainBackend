/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['lucide-react'],
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      zlib: require.resolve('browserify-zlib'),
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: 'devnet',
    NEXT_PUBLIC_RPC_ENDPOINT: 'https://api.devnet.solana.com'
  }
}