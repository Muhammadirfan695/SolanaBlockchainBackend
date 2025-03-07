import { PublicKey } from '@solana/web3.js';
import { TradeSignal } from './strategies/TradingStrategy';

interface PortfolioStats {
  totalValue: number;
  allocations: Map<string, number>;
  drawdown: number;
  volatility: number;
}

export class RiskManager {
  private static instance: RiskManager;
  private maxDrawdown: number = 0.15; // 15% maximum drawdown
  private maxPositionSize: number = 0.2; // 20% max allocation per position
  private stopLossLevels: Map<string, number> = new Map();
  private takeProfitLevels: Map<string, number> = new Map();

  static getInstance(): RiskManager {
    if (!RiskManager.instance) {
      RiskManager.instance = new RiskManager();
    }
    return RiskManager.instance;
  }

  validateTrade(signal: TradeSignal, portfolio: PortfolioStats): boolean {
    // Check portfolio risk limits
    if (!this.checkPortfolioRisk(portfolio)) {
      return false;
    }

    // Validate position size
    if (!this.validatePositionSize(signal.amount, portfolio.totalValue)) {
      return false;
    }

    // Check drawdown limits
    if (portfolio.drawdown > this.maxDrawdown) {
      return false;
    }

    return true;
  }

  setStopLoss(tokenAddress: string, entryPrice: number, risk: number): void {
    const stopLossPrice = entryPrice * (1 - risk);
    this.stopLossLevels.set(tokenAddress, stopLossPrice);
  }

  setTakeProfit(tokenAddress: string, entryPrice: number, target: number): void {
    const takeProfitPrice = entryPrice * (1 + target);
    this.takeProfitLevels.set(tokenAddress, takeProfitPrice);
  }

  private checkPortfolioRisk(portfolio: PortfolioStats): boolean {
    // Check overall portfolio risk metrics
    if (portfolio.volatility > 0.5) { // 50% annualized volatility limit
      return false;
    }

    // Check concentration risk
    for (const [_, allocation] of portfolio.allocations) {
      if (allocation > this.maxPositionSize) {
        return false;
      }
    }

    return true;
  }

  private validatePositionSize(amount: number, totalValue: number): boolean {
    const positionSize = amount / totalValue;
    return positionSize <= this.maxPositionSize;
  }

  calculateOptimalLeverage(
    volatility: number,
    correlation: number,
    sharpeRatio: number
  ): number {
    // Kelly Criterion based leverage calculation
    const expectedReturn = sharpeRatio * volatility;
    const optimalLeverage = (expectedReturn / volatility ** 2) * (1 - correlation);
    
    // Cap maximum leverage
    return Math.min(optimalLeverage, 2.0);
  }

  async rebalancePortfolio(
    portfolio: PortfolioStats,
    targetAllocations: Map<string, number>
  ): Promise<Map<string, number>> {
    const trades = new Map<string, number>();

    for (const [token, currentAllocation] of portfolio.allocations) {
      const targetAllocation = targetAllocations.get(token) || 0;
      
      if (Math.abs(currentAllocation - targetAllocation) > 0.05) { // 5% threshold
        trades.set(token, targetAllocation - currentAllocation);
      }
    }

    return trades;
  }
}