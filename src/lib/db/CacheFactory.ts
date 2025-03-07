import { isDevelopment } from '../config/environment';
import { MockCache } from './MockCache';
import { RedisCache } from './redis';

export class CacheFactory {
  static getCache() {
    if (isDevelopment) {
      return MockCache.getInstance();
    }
    return RedisCache.getInstance();
  }
}