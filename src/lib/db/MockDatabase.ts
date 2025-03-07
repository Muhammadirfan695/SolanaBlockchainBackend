import { CopyTradeConfig } from '../trading/CopyTradeManager';

export class MockDatabase {
  private static instance: MockDatabase;
  private data: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  async saveCopyTradeConfig(config: CopyTradeConfig): Promise<string> {
    const id = Math.random().toString(36).substring(7);
    this.data.set(`config:${id}`, config);
    return id;
  }

  async getCopyTradeConfig(id: string): Promise<CopyTradeConfig | null> {
    return this.data.get(`config:${id}`) || null;
  }

  async updateCopyTradeConfig(id: string, config: CopyTradeConfig): Promise<void> {
    this.data.set(`config:${id}`, config);
  }

  async getAllConfigs(): Promise<CopyTradeConfig[]> {
    return Array.from(this.data.values())
      .filter(item => item.type === 'copyTradeConfig');
  }

  async saveTradeHistory(trade: any): Promise<void> {
    const id = Date.now().toString();
    this.data.set(`trade:${id}`, trade);
  }

  async getTradeHistory(walletAddress: string): Promise<any[]> {
    return Array.from(this.data.values())
      .filter(item => 
        item.type === 'trade' && 
        item.walletAddress === walletAddress
      );
  }
}