import { CopyTradeConfig } from './CopyTradeManager';
import { CONFIG } from '../../config';

export class TradeValidator {
  validateConfig(config: CopyTradeConfig): boolean {
    try {
      // Validate minimum order size
      if (config.minOrderSize < CONFIG.MIN_TRADE_AMOUNT) {
        return false;
      }

      // Validate total allocation
      if (config.totalAllocation <= 0 || config.totalAllocation > CONFIG.MAX_TRADE_AMOUNT) {
        return false;
      }

      // Validate stop loss
      if (config.stopLossPercentage < 0 || config.stopLossPercentage > 100) {
        return false;
      }

      // Validate exit strategies
      if (!this.validateExitStrategies(config.exitStrategies)) {
        return false;
      }

      // Validate thresholds
      if (config.minBuyThreshold < CONFIG.MIN_TRADE_AMOUNT) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Config validation error:', error);
      return false;
    }
  }

  validateExitStrategies(strategies: CopyTradeConfig['exitStrategies']): boolean {
    if (!Array.isArray(strategies) || strategies.length === 0) {
      return false;
    }

    return strategies.every(strategy => 
      strategy.profitPercentage > 0 &&
      strategy.profitPercentage <= 1000 && // Max 1000% profit target
      strategy.sellPercentage > 0 &&
      strategy.sellPercentage <= 100
    );
  }

  validateTrade(
    trade: {
      tokenAddress: string;
      amount: number;
      side: 'buy' | 'sell';
    },
    config: CopyTradeConfig
  ): boolean {
    try {
      // Validate trade amount
      if (trade.amount < config.minOrderSize) {
        return false;
      }

      if (trade.amount > config.maxTokenAmount) {
        return false;
      }

      // For buy orders, check against minBuyThreshold
      if (trade.side === 'buy' && trade.amount < config.minBuyThreshold) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Trade validation error:', error);
      return false;
    }
  }
}