import { isDevelopment } from './environment';
import { PRODUCTION_CONFIG } from './production';

export class ConfigProvider {
  private static instance: ConfigProvider;
  private config: any;

  private constructor() {
    this.config = isDevelopment ? 
      this.getDevelopmentConfig() : 
      this.getProductionConfig();
  }

  static getInstance(): ConfigProvider {
    if (!ConfigProvider.instance) {
      ConfigProvider.instance = new ConfigProvider();
    }
    return ConfigProvider.instance;
  }

  private getDevelopmentConfig() {
    return {
      NETWORK: 'devnet',
      RPC_ENDPOINT: 'https://api.devnet.solana.com',
      WEBSOCKET_ENDPOINT: 'wss://api.devnet.solana.com',
      
      // Use in-memory storage for development
      storage: new Map(),
      cache: new Map(),
      
      // Simulated settings
      SIMULATED_LATENCY: 100,
      SUCCESS_RATE: 0.9,
      
      // Development features
      ENABLE_LOGGING: true,
      MOCK_SERVICES: true
    };
  }

  private getProductionConfig() {
    return PRODUCTION_CONFIG;
  }

  get(key: string): any {
    return this.config[key];
  }

  getAll(): any {
    return { ...this.config };
  }
}