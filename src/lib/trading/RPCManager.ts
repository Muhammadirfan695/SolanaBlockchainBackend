import { Connection, Commitment } from '@solana/web3.js';

export class RPCManager {
  private static instance: RPCManager;
  private connections: Map<string, Connection>;
  private healthChecks: Map<string, boolean>;
  private currentEndpoint: string;

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
      import.meta.env.VITE_BACKUP_RPC,
      import.meta.env.VITE_JITO_RPC
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
        }
      }
      await this.updateOptimalEndpoint();
    }, 5000);
  }

  private async updateOptimalEndpoint() {
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

    this.currentEndpoint = fastestEndpoint as string;
  }

  async getOptimizedConnection(): Promise<Connection> {
    await this.updateOptimalEndpoint();
    return this.connections.get(this.currentEndpoint)!;
  }
}