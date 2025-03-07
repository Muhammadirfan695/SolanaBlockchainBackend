import { TradeExecutor } from '../../lib/trading/TradeExecutor';
import { TransactionManager } from '../../lib/trading/TransactionManager';
import { RPCManager } from '../../lib/trading/RPCManager';

export class TradeCommands {
  private static executor = TradeExecutor.getInstance();
  private static txManager = TransactionManager.getInstance();
  private static rpcManager = RPCManager.getInstance();

  static async executeCopyTrade(
    sourceWallet: string,
    amount: number,
    side: 'buy' | 'sell'
  ): Promise<boolean> {
    try {
      console.log(`Executing ${side} trade for ${amount} SOL...`);
      
      const connection = await this.rpcManager.getOptimizedConnection();
      console.log(`Using RPC endpoint with ${connection.rpcEndpoint}`);

      const result = await this.executor.executeCopyTrade(
        sourceWallet,
        amount,
        side
      );

      if (result) {
        console.log('✓ Trade executed successfully');
      } else {
        console.error('✗ Trade execution failed');
      }

      return result;
    } catch (error) {
      console.error('Trade execution error:', error);
      return false;
    }
  }

  static async getTradeStatus(signature: string): Promise<void> {
    try {
      const connection = await this.rpcManager.getOptimizedConnection();
      const status = await connection.getSignatureStatus(signature);
      
      console.log('Trade Status:', {
        confirmed: status?.value?.confirmationStatus === 'confirmed',
        slot: status?.value?.slot,
        err: status?.value?.err || null
      });
    } catch (error) {
      console.error('Error getting trade status:', error);
    }
  }
}