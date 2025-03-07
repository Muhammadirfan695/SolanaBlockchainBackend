import React from 'react';
import { TrendingUp, LineChart, Award } from 'lucide-react';

interface BulkWalletAnalysisProps {
  traders: {
    address: string;
    invested: string;
    sold: { amount: string; transactions: number };
    pnl: string;
    remaining: { amount: string; transactions: number };
    balance: string;
  }[];
}

export default function BulkWalletAnalysis({ traders }: BulkWalletAnalysisProps) {
  const walletStats = [
    {
      address: "35B...CdD",
      realizedPnL: { amount: 86242, percentage: 4.81 },
      tokenWinrate: 71.49,
      tokensTraded: 940,
      chains: ["Solana"],
      timeframes: {
        "1d": "+2.5%",
        "7d": "+15.3%",
        "30d": "+45.8%",
        "all": "+156.2%"
      }
    },
    // Add more wallets here
  ];

  return (
    <div className="space-y-6">
      {walletStats.map((wallet, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-purple-400 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-white">Top Performing Wallet</h3>
                <p className="text-gray-400 font-mono">{wallet.address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Realized PnL (ROI)</p>
              <p className="text-2xl font-bold text-white">
                ${wallet.realizedPnL.amount.toLocaleString()} ({wallet.realizedPnL.percentage}%)
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Token Winrate</p>
              <p className="text-2xl font-bold text-white">{wallet.tokenWinrate}%</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Tokens Traded</p>
              <p className="text-2xl font-bold text-white">{wallet.tokensTraded}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(wallet.timeframes).map(([period, change]) => (
              <div key={period} className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">{period.toUpperCase()}</p>
                <p className={`text-lg font-bold ${
                  change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {change}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              View Detailed Analysis
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}