export const PRODUCTION_CONFIG = {
  // Solana Network
  NETWORK: 'mainnet-beta',
  RPC_ENDPOINTS: [
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com'
  ],
  WEBSOCKET_ENDPOINT: 'wss://api.mainnet-beta.solana.com',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/whalesx',
  REDIS_URI: process.env.REDIS_URI || 'redis://localhost:6379',

  // Trading
  MAX_CONCURRENT_TRADES: 50,
  TRADE_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  
  // Performance
  CACHE_TTL: 60 * 1000, // 1 minute
  BATCH_SIZE: 100,
  
  // Security
  MAX_REQUESTS_PER_MINUTE: 100,
  ENCRYPTION_ALGORITHM: 'aes-256-gcm'
}