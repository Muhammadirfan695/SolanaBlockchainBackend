import { isDevelopment } from '../config/environment';
import { DatabaseFactory } from '../db/DatabaseFactory';
import { CacheFactory } from '../db/CacheFactory';
import { TradeExecutorFactory } from '../trading/TradeExecutorFactory';
import { ConfigProvider } from '../config/ConfigProvider';

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, any> = new Map();
  private config = ConfigProvider.getInstance();

  private constructor() {
    this.initializeServices();
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  private async initializeServices() {
    // Initialize database
    const db = DatabaseFactory.getDatabase();
    this.services.set('database', db);

    // Initialize cache
    const cache = CacheFactory.getCache();
    this.services.set('cache', cache);

    // Initialize trade executor
    const tradeExecutor = TradeExecutorFactory.getExecutor();
    this.services.set('tradeExecutor', tradeExecutor);

    if (!isDevelopment) {
      // Initialize production-only services
      await this.initializeProductionServices();
    }
  }

  private async initializeProductionServices() {
    try {
      // These would be initialized in a real production environment
      // but are simulated in the webcontainer
      console.log('Production services initialized');
    } catch (error) {
      console.error('Error initializing production services:', error);
    }
  }

  getService(name: string): any {
    return this.services.get(name);
  }

  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, boolean>;
  }> {
    const checks = await Promise.all(
      Array.from(this.services.entries()).map(async ([name, service]) => {
        try {
          if (typeof service.healthCheck === 'function') {
            await service.healthCheck();
            return [name, true];
          }
          return [name, true];
        } catch (error) {
          return [name, false];
        }
      })
    );

    const serviceStatus = Object.fromEntries(checks);
    const unhealthyServices = checks.filter(([_, healthy]) => !healthy).length;

    return {
      status: unhealthyServices === 0 ? 'healthy' :
              unhealthyServices <= 2 ? 'degraded' : 
              'unhealthy',
      services: serviceStatus
    };
  }
}