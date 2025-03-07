import Redis from 'ioredis';
import { CONFIG } from '../../config';
import { CopyTradeConfig } from '../trading/CopyTradeManager';

export class RedisCache {
  private static instance: RedisCache;
  private client: Redis;
  private readonly CONFIG_PREFIX = 'copyTrade:config:';
  private readonly STATE_PREFIX = 'copyTrade:state:';
  private readonly CACHE_TTL = 3600; // 1 hour

  private constructor() {
    this.client = new Redis(CONFIG.REDIS_URI, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      }
    });

    this.client.on('error', (err) => {
      console.error('Redis Error:', err);
    });
  }

  static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  async cacheConfig(walletAddress: string, config: CopyTradeConfig): Promise<void> {
    try {
      const key = this.CONFIG_PREFIX + walletAddress;
      const value = JSON.stringify(config);

      // Use pipeline for atomic operations
      await this.client.pipeline()
        .setex(key, this.CACHE_TTL, value)
        .zadd('active_configs', Date.now(), walletAddress)
        .exec();
    } catch (error) {
      console.error('Redis cache error:', error);
      throw error;
    }
  }

  async getCachedConfig(walletAddress: string): Promise<CopyTradeConfig | null> {
    try {
      const cached = await this.client.get(this.CONFIG_PREFIX + walletAddress);
      if (!cached) return null;

      // Refresh TTL on hit
      await this.client.expire(this.CONFIG_PREFIX + walletAddress, this.CACHE_TTL);
      
      return JSON.parse(cached);
    } catch (error) {
      console.error('Redis get cache error:', error);
      return null;
    }
  }

  async invalidateConfig(walletAddress: string): Promise<void> {
    try {
      await this.client.pipeline()
        .del(this.CONFIG_PREFIX + walletAddress)
        .zrem('active_configs', walletAddress)
        .exec();
    } catch (error) {
      console.error('Redis invalidate error:', error);
      throw error;
    }
  }

  async getActiveConfigCount(): Promise<number> {
    try {
      return await this.client.zcard('active_configs');
    } catch (error) {
      console.error('Redis get active count error:', error);
      return 0;
    }
  }

  // Optimized batch operations
  async batchCacheConfigs(configs: CopyTradeConfig[]): Promise<void> {
    try {
      const pipeline = this.client.pipeline();
      
      for (const config of configs) {
        pipeline.setex(
          this.CONFIG_PREFIX + config.walletAddress,
          this.CACHE_TTL,
          JSON.stringify(config)
        );
      }

      await pipeline.exec();
    } catch (error) {
      console.error('Redis batch cache error:', error);
      throw error;
    }
  }
}