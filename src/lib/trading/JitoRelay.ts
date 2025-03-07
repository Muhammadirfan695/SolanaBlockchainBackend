import { Transaction, Connection } from '@solana/web3.js';
import { CONFIG } from '../../config';

export class JitoRelay {
  private static instance: JitoRelay;
  private connection: Connection;

  private constructor() {
    this.connection = new Connection(CONFIG.JITO_RPC_ENDPOINT, {
      commitment: 'processed',
      wsEndpoint: CONFIG.JITO_WS_ENDPOINT
    });
  }

  static getInstance(): JitoRelay {
    if (!JitoRelay.instance) {
      JitoRelay.instance = new JitoRelay();
    }
    return JitoRelay.instance;
  }

  async sendBundle(transactions: Transaction[]): Promise<string> {
    try {
      // Create a bundle of transactions
      const bundle = await this.createBundle(transactions);
      
      // Send via Jito relay with maximum tip
      const signature = await this.connection.sendRawTransaction(
        bundle.serialize(),
        {
          skipPreflight: true,
          maxRetries: 1,
          preflightCommitment: 'processed'
        }
      );

      return signature;
    } catch (error) {
      console.error('Error sending bundle:', error);
      throw error;
    }
  }

  private async createBundle(transactions: Transaction[]): Promise<Transaction> {
    const bundle = new Transaction();
    
    // Add Jito-specific instructions for MEV protection
    bundle.add(
      // Add Jito bundle instructions here
    );
    
    // Add all transactions to the bundle
    transactions.forEach(tx => {
      tx.instructions.forEach(instruction => {
        bundle.add(instruction);
      });
    });

    return bundle;
  }
}