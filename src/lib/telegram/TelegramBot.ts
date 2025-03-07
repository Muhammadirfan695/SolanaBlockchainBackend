import { RedisCache } from '../db/redis';
import { MongoDB } from '../db/mongodb';
import { TradeExecutor } from '../trading/TradeExecutor';

export interface TelegramBotConfig {
  id: string;
  name: string;
  channelId: string;
  botToken: string;
  isActive: boolean;
  filters: {
    keywords: string[];
    minAmount: number;
    maxAmount: number;
    excludeKeywords: string[];
  };
  buySettings: {
    amount: number;
    slippage: number;
    autoSell: boolean;
    takeProfit: number;
    stopLoss: number;
  };
  status: 'connected' | 'disconnected' | 'error';
  lastMessage?: string;
  lastUpdate?: Date;
}

export class TelegramBotManager {
  private static instance: TelegramBotManager;
  private activeBots: Map<string, any> = new Map();
  private redisCache: RedisCache;
  private mongodb: MongoDB;
  private tradeExecutor: TradeExecutor;

  private constructor() {
    this.redisCache = RedisCache.getInstance();
    this.mongodb = MongoDB.getInstance();
    this.tradeExecutor = TradeExecutor.getInstance();
  }

  static getInstance(): TelegramBotManager {
    if (!TelegramBotManager.instance) {
      TelegramBotManager.instance = new TelegramBotManager();
    }
    return TelegramBotManager.instance;
  }

  async startBot(config: TelegramBotConfig): Promise<boolean> {
    try {
      // Store config in MongoDB
      await this.mongodb.saveTelegramConfig(config);

      // Cache active config
      if (config.isActive) {
        await this.redisCache.cacheTelegramConfig(config.id, config);
        await this.initializeBot(config);
      }

      return true;
    } catch (error) {
      console.error('Error starting Telegram bot:', error);
      return false;
    }
  }

  private async initializeBot(config: TelegramBotConfig) {
    try {
      // Initialize Telegram bot with config.botToken
      const bot = {
        // Bot implementation would go here
        // This would connect to Telegram's API and listen for messages
        start: async () => {
          // Start listening to messages
          console.log(`Bot ${config.name} started listening`);
        },
        stop: async () => {
          // Stop listening to messages
          console.log(`Bot ${config.name} stopped listening`);
        }
      };

      // Store bot instance
      this.activeBots.set(config.id, bot);

      // Start listening
      await bot.start();

      // Update status
      await this.updateBotStatus(config.id, 'connected');
    } catch (error) {
      console.error('Error initializing bot:', error);
      await this.updateBotStatus(config.id, 'error');
    }
  }

  async stopBot(id: string): Promise<boolean> {
    try {
      const bot = this.activeBots.get(id);
      if (bot) {
        await bot.stop();
        this.activeBots.delete(id);
      }

      // Update status in cache and DB
      await this.updateBotStatus(id, 'disconnected');
      return true;
    } catch (error) {
      console.error('Error stopping bot:', error);
      return false;
    }
  }

  private async updateBotStatus(
    id: string,
    status: 'connected' | 'disconnected' | 'error'
  ): Promise<void> {
    try {
      const config = await this.redisCache.getTelegramConfig(id);
      if (config) {
        config.status = status;
        await this.redisCache.cacheTelegramConfig(id, config);
        await this.mongodb.updateTelegramConfig(id, config);
      }
    } catch (error) {
      console.error('Error updating bot status:', error);
    }
  }

  async processMessage(channelId: string, message: string): Promise<void> {
    try {
      const config = await this.getConfigByChannelId(channelId);
      if (!config || !config.isActive) return;

      // Check if message matches filters
      if (this.matchesFilters(message, config.filters)) {
        const tradeInfo = this.extractTradeInfo(message);
        if (tradeInfo) {
          await this.tradeExecutor.executeCopyTrade(
            tradeInfo.tokenAddress,
            config.buySettings.amount,
            tradeInfo.side
          );
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  private async getConfigByChannelId(channelId: string): Promise<TelegramBotConfig | null> {
    try {
      // Try cache first
      const configs = await this.redisCache.getAllTelegramConfigs();
      const config = configs.find(c => c.channelId === channelId);
      if (config) return config;

      // Fallback to DB
      return await this.mongodb.getTelegramConfigByChannelId(channelId);
    } catch (error) {
      console.error('Error getting config:', error);
      return null;
    }
  }

  private matchesFilters(message: string, filters: TelegramBotConfig['filters']): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Check for required keywords
    const hasKeywords = filters.keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );

    // Check for excluded keywords
    const hasExcluded = filters.excludeKeywords.some(keyword =>
      lowerMessage.includes(keyword.toLowerCase())
    );

    return hasKeywords && !hasExcluded;
  }

  private extractTradeInfo(message: string): { tokenAddress: string; side: 'buy' | 'sell' } | null {
    // Implement message parsing logic here
    // This would extract token addresses and trade direction from the message
    return null;
  }
}