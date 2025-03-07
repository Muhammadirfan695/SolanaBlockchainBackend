import { TradingStrategy, TradeSignal } from './TradingStrategy';

interface MomentumIndicators {
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  volume: number;
}

export class MomentumStrategy extends TradingStrategy {
  private rsiThreshold = {
    oversold: 30,
    overbought: 70
  };

  async analyze(data: MomentumIndicators): Promise<TradeSignal | null> {
    const { rsi, macd, volume } = data;
    
    // Calculate momentum score
    const momentumScore = this.calculateMomentumScore(rsi, macd, volume);
    
    if (momentumScore > 0.8) {
      return {
        side: 'buy',
        confidence: momentumScore,
        amount: this.calculatePosition({ ...data, confidence: momentumScore } as TradeSignal),
        timestamp: Date.now(),
        tokenAddress: '',
        price: 0
      };
    }

    if (momentumScore < -0.8) {
      return {
        side: 'sell',
        confidence: Math.abs(momentumScore),
        amount: this.calculatePosition({ ...data, confidence: Math.abs(momentumScore) } as TradeSignal),
        timestamp: Date.now(),
        tokenAddress: '',
        price: 0
      };
    }

    return null;
  }

  validateSignal(signal: TradeSignal): boolean {
    return signal.confidence >= this.minConfidence;
  }

  calculatePosition(signal: TradeSignal): number {
    // Position size based on confidence and risk parameters
    const baseSize = 1000; // Base position size in USD
    const confidenceAdjustment = signal.confidence * 0.5; // Scale based on confidence
    const riskAdjustment = this.calculateRiskAdjustment();
    
    return baseSize * confidenceAdjustment * riskAdjustment;
  }

  private calculateMomentumScore(rsi: number, macd: any, volume: number): number {
    // RSI component
    const rsiScore = this.calculateRSIScore(rsi);
    
    // MACD component
    const macdScore = this.calculateMACDScore(macd);
    
    // Volume component
    const volumeScore = this.normalizeVolume(volume);
    
    // Weighted average of components
    return (rsiScore * 0.4) + (macdScore * 0.4) + (volumeScore * 0.2);
  }

  private calculateRSIScore(rsi: number): number {
    if (rsi <= this.rsiThreshold.oversold) {
      return 1; // Strong buy signal
    }
    if (rsi >= this.rsiThreshold.overbought) {
      return -1; // Strong sell signal
    }
    return 0;
  }

  private calculateMACDScore(macd: any): number {
    const { value, signal, histogram } = macd;
    const crossoverSignal = value > signal ? 1 : -1;
    const histogramStrength = Math.min(Math.abs(histogram) / 2, 1);
    
    return crossoverSignal * histogramStrength;
  }

  private normalizeVolume(volume: number): number {
    // Normalize volume to a score between -1 and 1
    return Math.min(Math.max((volume - 50) / 50, -1), 1);
  }

  private calculateRiskAdjustment(): number {
    // Implement dynamic risk adjustment based on market conditions
    return 1.0;
  }
}