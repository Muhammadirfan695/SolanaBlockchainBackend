import { MongoClient, Db } from 'mongodb';
import { CONFIG } from '../../config';

export class MongoDB {
  private static instance: MongoDB;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    this.client = new MongoClient(CONFIG.MONGODB_URI);
  }

  static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(CONFIG.MONGODB_DB_NAME);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async saveCopyTradeConfig(config: any): Promise<string> {
    if (!this.db) throw new Error('Database not connected');

    try {
      const collection = this.db.collection('copyTradeConfigs');
      const result = await collection.insertOne({
        ...config,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return result.insertedId.toString();
    } catch (error) {
      console.error('Error saving copy trade config:', error);
      throw error;
    }
  }

  async updateCopyTradeConfig(id: string, config: any): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      const collection = this.db.collection('copyTradeConfigs');
      await collection.updateOne(
        { _id: id },
        {
          $set: {
            ...config,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      console.error('Error updating copy trade config:', error);
      throw error;
    }
  }

  async getCopyTradeConfig(id: string): Promise<any> {
    if (!this.db) throw new Error('Database not connected');

    try {
      const collection = this.db.collection('copyTradeConfigs');
      return await collection.findOne({ _id: id });
    } catch (error) {
      console.error('Error getting copy trade config:', error);
      throw error;
    }
  }

  async saveTradeHistory(trade: any): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      const collection = this.db.collection('tradeHistory');
      await collection.insertOne({
        ...trade,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error saving trade history:', error);
      throw error;
    }
  }

  async getTradeHistory(walletAddress: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not connected');

    try {
      const collection = this.db.collection('tradeHistory');
      return await collection
        .find({ walletAddress })
        .sort({ timestamp: -1 })
        .limit(100)
        .toArray();
    } catch (error) {
      console.error('Error getting trade history:', error);
      throw error;
    }
  }
}