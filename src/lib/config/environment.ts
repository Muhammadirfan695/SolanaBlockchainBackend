export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

export const CONFIG = {
  // Common settings
  SOLANA_NETWORK: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
  RPC_ENDPOINT: import.meta.env.VITE_RPC_ENDPOINT || 'https://api.devnet.solana.com',

  // Development stubs
  DEV_STUBS: {
    MOCK_TRANSACTIONS: true,
    MOCK_WALLET_OPERATIONS: true,
    MOCK_DATABASE: true,
    MOCK_CACHE: true
  },

  // Cache settings
  CACHE_DURATION: 60 * 1000, // 1 minute
  
  // Database settings
  DB_CONNECTION_RETRIES: 3,
  DB_RETRY_INTERVAL: 1000,

  // Trading settings
  MIN_TRADE_AMOUNT: 0.001,
  MAX_TRADE_AMOUNT: 100,
  DEFAULT_SLIPPAGE: 0.5,
}