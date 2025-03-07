import { TradingStrategy, TradeSignal } from './TradingStrategy';

interface PriceData {
  current: number;
  sma20: number;
  sma50: number;
  standardDeviation: number;
  volume: number;
}

export class MeanReversionStrategy extends TradingStrategy {
  private deviationThreshold = 2; // Number of standard deviations
  private volumeThreshold = 1.5; // Minimum volume multiplier

  async analyze(data: PriceData): Promise<TradeSignal | null> {
    const { current, sma20, standardDeviation, volume } = data;
    
    // Calculate z-score
    const zScore = (current - sma20) / standardDeviation;
    
    // Check for mean reversion opportunity
    if (Math.abs(zScore) >= this.deviationThreshold && volume >= this.volumeThreshold) {
      const signal: TradeSignal = {
        side: zScore > 0 ? 'sell' : 'buy',
        confidence: this.calculateConfidence(zScore, volume),
        amount: 0, // Will be calculated
        timestamp: Date.now(),
        tokenAddress: '',
        price: current
      };
      
      signal.amount = this.calculatePosition(signal);
      return signal;
    }

    return null;
  }

  validateSignal(signal: TradeSignal): boolean {
    return (
      signal.confidence >= this.minConfidence &&
      signal.amount > 0 &&
      Math.abs(signal.price) > 0
    );
  }

  calculatePosition(signal: TradeSignal): number {
    const basePosition = 1000; // Base position size
    const confidenceMultiplier = signal.confidence;
    const volatilityAdjustment = this.calculateVolatilityAdjustment();
    
    return basePosition * confidenceMultiplier * volatilityAdjustment;
  }

  private calculateConfidence(zScore: number, volume: number): number {
    // Higher confidence for larger deviations and higher volume
    const deviationConfidence = Math.min(Math.abs(zScore) / 4, 1);
    const volumeConfidence = Math.min(volume / 2, 1);
    
    return (deviationConfidence * 0.7) + (volumeConfidence * 0.3);
  }

  private calculateVolatilityAdjustment(): number {
    // Implement volatility-based position sizing
    return 1.0;
  }
}