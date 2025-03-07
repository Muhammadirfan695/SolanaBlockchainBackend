import { PublicKey } from '@solana/web3.js';

interface TraderMetrics {
  successfulTrades: number;
  totalTrades: number;
  averageROI: number;
  riskScore: number;
  consistencyScore: number;
  followers: number;
}

export class ReputationSystem {
  private static instance: ReputationSystem;
  private traderMetrics: Map<string, TraderMetrics> = new Map();

  private constructor() {}

  static getInstance(): ReputationSystem {
    if (!ReputationSystem.instance) {
      ReputationSystem.instance = new ReputationSystem();
    }
    return ReputationSystem.instance;
  }

  calculateReputation(walletAddress: string): number {
    const metrics = this.traderMetrics.get(walletAddress);
    if (!metrics) return 0;

    const {
      successfulTrades,
      totalTrades,
      averageROI,
      riskScore,
      consistencyScore,
      followers
    } = metrics;

    // Weighted calculation of reputation score
    const winRate = (successfulTrades / totalTrades) * 100;
    const roiWeight = Math.min(averageROI / 100, 1);
    const riskWeight = 1 - (riskScore / 100);
    const followerWeight = Math.min(followers / 1000, 1);

    const reputationScore = (
      winRate * 0.3 +
      roiWeight * 0.3 +
      riskWeight * 0.2 +
      consistencyScore * 0.1 +
      followerWeight * 0.1
    );

    return Math.min(Math.round(reputationScore), 100);
  }

  async updateTraderMetrics(
    walletAddress: string,
    metrics: Partial<TraderMetrics>
  ): Promise<void> {
    const currentMetrics = this.traderMetrics.get(walletAddress) || {
      successfulTrades: 0,
      totalTrades: 0,
      averageROI: 0,
      riskScore: 50,
      consistencyScore: 0,
      followers: 0
    };

    this.traderMetrics.set(walletAddress, {
      ...currentMetrics,
      ...metrics
    });
  }

  getTraderRank(walletAddress: string): number {
    const traders = Array.from(this.traderMetrics.entries())
      .map(([address, metrics]) => ({
        address,
        reputation: this.calculateReputation(address)
      }))
      .sort((a, b) => b.reputation - a.reputation);

    const index = traders.findIndex(t => t.address === walletAddress);
    return index + 1;
  }

  async followTrader(
    followerAddress: string,
    traderAddress: string
  ): Promise<boolean> {
    try {
      const metrics = this.traderMetrics.get(traderAddress);
      if (metrics) {
        await this.updateTraderMetrics(traderAddress, {
          followers: metrics.followers + 1
        });
      }
      return true;
    } catch (error) {
      console.error('Error following trader:', error);
      return false;
    }
  }

  async unfollowTrader(
    followerAddress: string,
    traderAddress: string
  ): Promise<boolean> {
    try {
      const metrics = this.traderMetrics.get(traderAddress);
      if (metrics && metrics.followers > 0) {
        await this.updateTraderMetrics(traderAddress, {
          followers: metrics.followers - 1
        });
      }
      return true;
    } catch (error) {
      console.error('Error unfollowing trader:', error);
      return false;
    }
  }
}