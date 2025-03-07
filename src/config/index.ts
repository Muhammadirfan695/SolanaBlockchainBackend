export const CONFIG = {
  // Solana Network
  NETWORK: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
  RPC_ENDPOINT: import.meta.env.VITE_RPC_ENDPOINT || 'https://api.devnet.solana.com',
  
  // Program
  PROGRAM_ID: 'your_program_id',
  
  // Trading
  MIN_TRADE_AMOUNT: 0.001,
  MAX_TRADE_AMOUNT: 100,
  DEFAULT_SLIPPAGE: 0.5,
  
  // Wallet
  WALLET_STORAGE_KEY: 'whales_x_wallet',
  KEY_EXPIRY_DURATION: 48 * 60 * 60 * 1000, // 48 hours
  
  // Cache
  CACHE_DURATION: 60 * 1000, // 1 minute
  
  // UI
  THEME: {
    primary: 'purple',
    secondary: 'blue',
    accent: 'yellow'
  },
  
  // Features
  FEATURES: {
    NOTIFICATIONS: true,
    ANALYTICS: true,
    ADVANCED_CHARTS: true
  }
};