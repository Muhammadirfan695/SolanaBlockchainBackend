import WebSocket from 'ws';
import { CONFIG } from '../../config';
import { TradeExecutor } from '../trading/TradeExecutor';
import { RedisCache } from '../db/redis';

export class TradeWatcher {
  private static instance: TradeWatcher;
  private ws: WebSocket | null = null;
  private tradeExecutor: TradeExecutor;
  private redisCache: RedisCache;
  private watchedWallets: Set<string> = new Set();

  private constructor() {
    this.tradeExecutor = TradeExecutor.getInstance();
    this.redisCache = RedisCache.getInstance();
  }

  static getInstance(): TradeWatcher {
    if (!TradeWatcher.instance) {
      TradeWatcher.instance = new TradeWatcher();
    }
    return TradeWatcher.instance;
  }

  async startWatching(walletAddress: string): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    if (!this.watchedWallets.has(walletAddress)) {
      this.watchedWallets.add(walletAddress);
      this.subscribeToWallet(walletAddress);
    }
  }

  async stopWatching(walletAddress: string): Promise<void> {
    if (this.watchedWallets.has(walletAddress)) {
      this.watchedWallets.delete(walletAddress);
      this.unsubscribeFromWallet(walletAddress);
    }
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(CONFIG.SOLANA_WS_ENDPOINT);

      this.ws.on('open', () => {
        console.log('WebSocket connected');
        resolve();
      });

      this.ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(message);
        } catch (error) {
          console.error('WebSocket message handling error:', error);
        }
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket closed, attempting reconnect...');
        setTimeout(() => this.connect(), 5000);
      });
    });
  }

  private async handleMessage(message: any): Promise<void> {
    if (message.type === 'transaction') {
      const walletAddress = message.data.owner;
      
      if (this.watchedWallets.has(walletAddress)) {
        const config = await this.redisCache.getCachedConfig(walletAddress);
        
        if (config && config.isActive) {
          await this.tradeExecutor.executeCopyTrade(
            walletAddress,
            message.data.amount,
            message.data.side
          );
        }
      }
    }
  }

  private subscribeToWallet(walletAddress: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        walletAddress
      }));
    }
  }

  private unsubscribeFromWallet(walletAddress: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        walletAddress
      }));
    }
  }
}