import { PumpFunService } from './PumpFunService';
import { RaydiumService } from './RaydiumService';
import { IntegratedWallet } from '../../lib/wallet/IntegratedWallet';
import { ErrorReporter } from '../../lib/monitoring/ErrorReporter';
import { PerformanceMonitor } from '../../lib/monitoring/PerformanceMonitor';

export class AutoTradingService {
  private static instance: AutoTradingService;
  private pumpFun = PumpFunService.getInstance();
  private raydium = RaydiumService.getInstance();
  private errorReporter = ErrorReporter.getInstance();
  private performanceMonitor = PerformanceMonitor.getInstance();

  private constructor() {}

  static getInstance(): AutoTradingService {
    if (!AutoTradingService.instance) {
      AutoTradingService.instance = new AutoTradingService();
    }
    return AutoTradingService.instance;
  }

  async executeAutoTrade(
    wallet: IntegratedWallet,
    config: {
      tokenAddress: string;
      amount: number;
      buyOnPumpFun: boolean;
      sellOnRaydium: boolean;
      minProfit: number;
      maxSlippage: number;
    }
  ): Promise<{
    success: boolean;
    buyTxHash?: string;
    sellTxHash?: string;
    profit?: number;
    error?: string;
  }> {
    const endOperation = this.performanceMonitor.startOperation('auto_trade');

    try {
      let buyTxHash: string | undefined;
      let sellTxHash: string | undefined;

      // Buy on PumpFun if configured
      if (config.buyOnPumpFun) {
        const buyResult = await this.pumpFun.buyToken(
          wallet,
          config.tokenAddress,
          config.amount
        );
        
        if (!buyResult.success) {
          throw new Error('Buy transaction failed');
        }
        
        buyTxHash = buyResult.txHash;
      }

      // Monitor price and sell on Raydium when profitable
      if (config.sellOnRaydium) {
        const initialPrice = await this.pumpFun.getTokenPrice(config.tokenAddress);
        const currentPrice = await this.raydium.getPoolInfo(config.tokenAddress);
        
        const profit = ((currentPrice.liquidity / initialPrice) - 1) * 100;
        
        if (profit >= config.minProfit) {
          const sellResult = await this.raydium.sellToken(
            wallet,
            config.tokenAddress,
            config.amount
          );
          
          if (!sellResult.success) {
            throw new Error('Sell transaction failed');
          }
          
          sellTxHash = sellResult.txHash;
          
          endOperation();
          return {
            success: true,
            buyTxHash,
            sellTxHash,
            profit
          };
        }
      }

      endOperation();
      return { success: true, buyTxHash };

    } catch (error) {
      const err = error as Error;
      this.errorReporter.reportError(err, 'high', {
        tokenAddress: config.tokenAddress,
        amount: config.amount
      });
      
      this.performanceMonitor.recordError('auto_trade');
      endOperation();
      
      return { 
        success: false,
        error: err.message
      };
    }
  }

  async getTradeStatus(txHash: string): Promise<{
    status: 'confirmed' | 'pending' | 'failed';
    confirmations?: number;
  }> {
    try {
      const pumpFunStatus = await this.pumpFun.getTransactionStatus(txHash);
      const raydiumStatus = await this.raydium.getTransactionStatus(txHash);

      if (pumpFunStatus.confirmed || raydiumStatus.confirmed) {
        return {
          status: 'confirmed',
          confirmations: Math.max(
            pumpFunStatus.confirmations || 0,
            raydiumStatus.confirmations || 0
          )
        };
      }

      if (pumpFunStatus.failed || raydiumStatus.failed) {
        return { status: 'failed' };
      }

      return { status: 'pending' };

    } catch (error) {
      this.errorReporter.reportError(error as Error, 'medium', { txHash });
      return { status: 'failed' };
    }
  }
}