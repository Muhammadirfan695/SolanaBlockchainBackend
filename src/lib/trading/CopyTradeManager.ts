import { DatabaseFactory } from '../db/DatabaseFactory';
import { CacheFactory } from '../db/CacheFactory';
import { TradeExecutorFactory } from './TradeExecutorFactory';
import { TradeValidator } from './TradeValidator';

export class CopyTradeManager {
  private static instance: CopyTradeManager;
  private database = DatabaseFactory.getDatabase();
  private cache = CacheFactory.getCache();
  private tradeExecutor = TradeExecutorFactory.getExecutor();
  private tradeValidator = new TradeValidator();

  private constructor() {}

  static getInstance(): CopyTradeManager {
    if (!CopyTradeManager.instance) {
      CopyTradeManager.instance = new CopyTradeManager();
    }
    return CopyTradeManager.instance;
  }

  async addCopyTradeConfig(config: CopyTradeConfig): Promise<boolean> {
    try {
      if (!this.tradeValidator.validateConfig(config)) {
        throw new Error('Invalid copy trade configuration');
      }

      const id = await this.database.saveCopyTradeConfig(config);

      if (config.isActive) {
        await this.cache.set(
          `config:${config.walletAddress}`,
          config,
          60 * 1000 // 1 minute cache
        );
      }

      return true;
    } catch (error) {
      console.error('Error adding copy trade config:', error);
      return false;
    }
  }

  async executeCopyTrade(
    sourceWallet: string,
    tradeDetails: {
      tokenAddress: string;
      amount: number;
      side: 'buy' | 'sell';
    }
  ): Promise<boolean> {
    try {
      const config = await this.getTradeConfig(sourceWallet);
      
      if (!config || !config.isActive) {
        throw new Error('No active copy trade configuration found');
      }

      if (!this.tradeValidator.validateTrade(tradeDetails, config)) {
        throw new Error('Trade validation failed');
      }

      return await this.tradeExecutor.executeCopyTrade(
        sourceWallet,
        tradeDetails.amount,
        tradeDetails.side
      );
    } catch (error) {
      console.error('Error executing copy trade:', error);
      return false;
    }
  }

  private async getTradeConfig(walletAddress: string): Promise<CopyTradeConfig | null> {
    // Try cache first
    const cached = await this.cache.get(`config:${walletAddress}`);
    if (cached) return cached;

    // Fallback to database
    const config = await this.database.getCopyTradeConfig(walletAddress);
    if (config) {
      await this.cache.set(`config:${walletAddress}`, config, 60 * 1000);
    }
    
    return config;
  }
}