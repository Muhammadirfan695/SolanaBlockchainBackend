import { Connection, Commitment } from '@solana/web3.js';
import { PerformanceMonitor } from '../monitoring/PerformanceMonitor';
import { ErrorReporter } from '../monitoring/ErrorReporter';

export class RPCManager {
  private static instance: RPCManager;
  private connections: Map<string, Connection>;
  private healthChecks: Map<string, boolean>;
  private currentEndpoint: string;
  private performanceMonitor = PerformanceMonitor.getInstance();
  private errorReporter = ErrorReporter.getInstance();

  private constructor() {
    this.connections = new Map();
    this.healthChecks = new Map();
    this.currentEndpoint = import.meta.env.VITE_QUICKNODE_RPC;
    this.initializeConnections();
  }

  static getInstance(): RPCManager {
    if (!RPCManager.instance) {
      RPCManager.instance = new RPCManager();
    }
    return RPCManager.instance;
  }

  private initializeConnections() {
    const endpoints = [
      import.meta.env.VITE_QUICKNODE_RPC,
      import.meta.env.VITE_JITO_RPC,
      import.meta.env.VITE_BACKUP_RPC
    ];

    endpoints.forEach(endpoint => {
      if (!endpoint) return;
      
      this.connections.set(
        endpoint,
        new Connection(endpoint, {
          commitment: 'processed',
          confirmTransactionInitialTimeout: 20000,
          wsEndpoint: endpoint.replace('https', 'wss')
        })
      );
      this.healthChecks.set(endpoint, true);
    });

    this.startHealthCheck();
  }

  private async startHealthCheck() {
    setInterval(async () => {
      for (const [endpoint, connection] of this.connections) {
        try {
          const health = await connection.getHealth();
          this.healthChecks.set(endpoint, health === 'ok');
        } catch {
          this.healthChecks.set(endpoint, false);
          this.errorReporter.reportError(
            new Error(`RPC endpoint ${endpoint} is unhealthy`),
            'medium'
          );
        }
      }
      await this.updateOptimalEndpoint();
    }, 5000);
  }

  private async updateOptimalEndpoint() {
    const endOperation = this.performanceMonitor.startOperation('rpc_latency_check');

    try {
      const latencies = await Promise.all(
        Array.from(this.connections.entries()).map(async ([endpoint, connection]) => {
          if (!this.healthChecks.get(endpoint)) return [endpoint, Infinity];
          
          const start = performance.now();
          try {
            await connection.getSlot();
            return [endpoint, performance.now() - start];
          } catch {
            return [endpoint, Infinity];
          }
        })
      );

      const [fastestEndpoint] = latencies.reduce((a, b) => 
        (a[1] as number) < (b[1] as number) ? a : b
      );

      if (fastestEndpoint !== this.currentEndpoint) {
        this.currentEndpoint = fastestEndpoint as string;
      }

    } catch (error) {
      this.errorReporter.reportError(error as Error, 'medium');
    } finally {
      endOperation();
    }
  }

  async getOptimizedConnection(): Promise<Connection> {
    await this.updateOptimalEndpoint();
    return this.connections.get(this.currentEndpoint)!;
  }

  getCurrentConnection(): Connection {
    return this.connections.get(this.currentEndpoint)!;
  }
}