import { Connection, Transaction, TransactionInstruction } from '@solana/web3.js';
import { RPCManager } from './RPCManager';
import { TransactionOptimizer } from './TransactionOptimizer';
import { MongoDB } from '../db/mongodb';
import { RedisCache } from '../db/redis';

export class TransactionManager {
  private static instance: TransactionManager;
  private rpcManager: RPCManager;
  private optimizer: TransactionOptimizer;
  private mongodb: MongoDB;
  private redisCache: RedisCache;

  private constructor() {
    this.rpcManager = RPCManager.getInstance();
    this.optimizer = TransactionOptimizer.getInstance(
      this.rpcManager.getCurrentConnection()
    );
    this.mongodb = MongoDB.getInstance();
    this.redisCache = RedisCache.getInstance();
  }

  static getInstance(): TransactionManager {
    if (!TransactionManager.instance) {
      TransactionManager.instance = new TransactionManager();
    }
    return TransactionManager.instance;
  }

  async executeTransaction(
    instructions: TransactionInstruction[],
    walletAddress: string,
    options: {
      maxRetries?: number;
      priorityFee?: number;
    } = {}
  ): Promise<string> {
    const connection = await this.rpcManager.getOptimizedConnection();
    const config = await this.redisCache.getCachedConfig(walletAddress);

    if (!config) {
      throw new Error('No active configuration found for wallet');
    }

    try {
      // Optimize transaction with user's configuration
      const transaction = await this.optimizer.optimizeTransaction(
        instructions,
        {
          maxPriorityFee: config.priorityFeeMode === 'auto',
          customPriorityFee: config.customPriorityFee
        }
      );

      // Send and confirm transaction
      const signature = await this.sendAndConfirmTransaction(
        connection,
        transaction,
        options
      );

      // Save transaction to history
      await this.mongodb.saveTradeHistory({
        walletAddress,
        signature,
        timestamp: new Date(),
        status: 'success'
      });

      return signature;
    } catch (error) {
      console.error('Transaction execution error:', error);
      
      // Save failed transaction to history
      await this.mongodb.saveTradeHistory({
        walletAddress,
        error: error.message,
        timestamp: new Date(),
        status: 'failed'
      });

      throw error;
    }
  }

  private async sendAndConfirmTransaction(
    connection: Connection,
    transaction: Transaction,
    options: {
      maxRetries?: number;
      priorityFee?: number;
    }
  ): Promise<string> {
    const maxRetries = options.maxRetries || 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const signature = await connection.sendRawTransaction(
          transaction.serialize(),
          {
            skipPreflight: true,
            maxRetries: 1,
            preflightCommitment: 'processed'
          }
        );

        // Wait for confirmation
        const confirmation = await connection.confirmTransaction(
          signature,
          'processed'
        );

        if (confirmation.value.err) {
          throw new Error('Transaction failed to confirm');
        }

        return signature;
      } catch (error) {
        attempts++;
        if (attempts === maxRetries) throw error;
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempts) * 1000)
        );
      }
    }

    throw new Error('Max retries exceeded');
  }
}