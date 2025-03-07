import { 
  Connection, 
  Transaction, 
  TransactionInstruction, 
  ComputeBudgetProgram
} from '@solana/web3.js';
import { PerformanceMonitor } from '../monitoring/PerformanceMonitor';

export class TransactionOptimizer {
  private static instance: TransactionOptimizer;
  private connection: Connection;
  private performanceMonitor = PerformanceMonitor.getInstance();
  private readonly MAX_COMPUTE_UNITS = 1_400_000;
  private readonly MAX_PRIORITY_FEE = 1_000_000; // 0.001 SOL

  private constructor(connection: Connection) {
    this.connection = connection;
  }

  static getInstance(connection: Connection): TransactionOptimizer {
    if (!TransactionOptimizer.instance) {
      TransactionOptimizer.instance = new TransactionOptimizer(connection);
    }
    return TransactionOptimizer.instance;
  }

  async optimizeTransaction(
    instructions: TransactionInstruction[],
    options: { maxPriorityFee?: boolean } = {}
  ): Promise<Transaction> {
    const endOperation = this.performanceMonitor.startOperation('optimize_transaction');

    try {
      const transaction = new Transaction();
      
      // Add priority fee instruction first
      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.maxPriorityFee ? 
            this.MAX_PRIORITY_FEE : 
            await this.calculateOptimalPriorityFee()
        })
      );
      
      // Add compute unit limit instruction
      transaction.add(
        ComputeBudgetProgram.setComputeUnitLimit({
          units: this.MAX_COMPUTE_UNITS
        })
      );
      
      // Add the actual transaction instructions
      instructions.forEach(instruction => {
        transaction.add(instruction);
      });

      // Get recent blockhash with preflight commitment
      const { blockhash, lastValidBlockHeight } = 
        await this.connection.getLatestBlockhash('processed');
      
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;

      endOperation();
      return transaction;

    } catch (error) {
      endOperation();
      throw error;
    }
  }

  private async calculateOptimalPriorityFee(): Promise<number> {
    try {
      const recentPrioritizationFees = 
        await this.connection.getRecentPrioritizationFees();
      
      if (recentPrioritizationFees.length === 0) {
        return this.MAX_PRIORITY_FEE / 2; // Default to half max
      }

      // Use 90th percentile fee for high priority
      const sortedFees = recentPrioritizationFees
        .map(fee => fee.prioritizationFee)
        .sort((a, b) => b - a);
      
      const index = Math.floor(sortedFees.length * 0.1);
      const baseFee = sortedFees[index];
      
      // Add 20% margin for higher priority
      return Math.min(
        Math.ceil(baseFee * 1.2),
        this.MAX_PRIORITY_FEE
      );
    } catch (error) {
      console.warn('Error calculating priority fee:', error);
      return this.MAX_PRIORITY_FEE / 2;
    }
  }
}