import { TradeExecutor } from './TradeExecutor';

export class MockTradeExecutor extends TradeExecutor {
  async executeCopyTrade(
    traderAddress: string,
    amount: number,
    side: 'buy' | 'sell'
  ): Promise<boolean> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate 90% success rate
    const success = Math.random() < 0.9;

    if (success) {
      console.log('Mock trade executed:', {
        traderAddress,
        amount,
        side,
        timestamp: new Date().toISOString()
      });
    }

    return success;
  }

  async validateTrade(
    tokenAddress: string,
    amount: number,
    side: 'buy' | 'sell'
  ): Promise<boolean> {
    // Simulate basic validation
    return amount > 0 && ['buy', 'sell'].includes(side);
  }

  async getTradeStatus(signature: string): Promise<'success' | 'pending' | 'failed'> {
    // Simulate status check
    await new Promise(resolve => setTimeout(resolve, 200));
    return Math.random() < 0.9 ? 'success' : 'failed';
  }
}