import { Transaction, Connection } from '@solana/web3.js';
import { PerformanceMonitor } from '../monitoring/PerformanceMonitor';
import { ErrorReporter } from '../monitoring/ErrorReporter';

export class JitoRelay {
  private static instance: JitoRelay;
  private connection: Connection;
  private performanceMonitor = PerformanceMonitor.getInstance();
  private errorReporter = ErrorReporter.getInstance();

  private constructor() {
    this.connection = new Connection(import.meta.env.VITE_JITO_RPC, {
      commitment: 'processed',
      wsEndpoint: import.meta.env.VITE_JITO_WS
    });
  }

  static getInstance(): JitoRelay {
    if (!JitoRelay.instance) {
      JitoRelay.instance = new JitoRelay();
    }
    return JitoRelay.instance;
  }

  async sendBundle(transactions: Transaction[]): Promise<string> {
    const endOperation = this.performanceMonitor.startOperation('jito_bundle_send');

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

      endOperation();
      return signature;

    } catch (error) {
      this.errorReporter.reportError(error as Error, 'high', {
        transactionCount: transactions.length
      });
      endOperation();
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