import { PublicKey } from '@solana/web3.js';
import { CONFIG } from '../../../config';

export interface TradeSignal {
  tokenAddress: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  confidence: number;
  timestamp: number;
}

export abstract class TradingStrategy {
  protected minConfidence: number = 0.7;
  protected maxSlippage: number = 0.02;
  protected rebalanceThreshold: number = 0.1;

  abstract analyze(data: any): Promise<TradeSignal | null>;
  abstract validateSignal(signal: TradeSignal): boolean;
  abstract calculatePosition(signal: TradeSignal): number;

  protected calculateOptimalTiming(
    signal: TradeSignal,
    historicalVolatility: number
  ): number {
    const currentHour = new Date().getUTCHours();
    const volatilityFactor = Math.min(historicalVolatility, 1);
    
    // Adjust timing based on market hours and volatility
    const timingScore = this.getMarketTimingScore(currentHour) * (1 - volatilityFactor);
    
    return timingScore;
  }

  private getMarketTimingScore(hour: number): number {
    // Score based on historical market activity
    const marketHours = {
      peak: [14, 15, 16], // UTC hours of highest activity
      active: [13, 17, 18],
      moderate: [11, 12, 19, 20],
      low: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 21, 22, 23]
    };

    if (marketHours.peak.includes(hour)) return 1;
    if (marketHours.active.includes(hour)) return 0.8;
    if (marketHours.moderate.includes(hour)) return 0.6;
    return 0.4;
  }

  protected shouldRebalance(
    currentAllocation: number,
    targetAllocation: number
  ): boolean {
    const deviation = Math.abs(currentAllocation - targetAllocation) / targetAllocation;
    return deviation > this.rebalanceThreshold;
  }
}