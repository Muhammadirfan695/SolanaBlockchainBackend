import React from 'react';
import { Settings, Share2, ExternalLink } from 'lucide-react';

interface TraderStatsProps {
  trader: {
    name: string;
    walletAddress: string;
    roi: number;
    pnlPercentage: number;
    solanaInvested: number;
  };
}

export default function TraderStats({ trader }: TraderStatsProps) {
  const copyStats = {
    totalInvested: 0.05,
    totalInvestedUSD: 9.697,
    realizedPnL: { sol: 0.09, percentage: 0 },
    unrealizedPnL: { sol: 0, percentage: 0 },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-purple-400 mr-2" />
            <h2 className="text-xl font-bold text-white">Copy Trading Overview</h2>
          </div>
          <button className="flex items-center text-gray-400 hover:text-white">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Invested via Copy Trade</p>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">{copyStats.totalInvested} SOL</span>
              <span className="text-sm text-gray-400 ml-2">${copyStats.totalInvestedUSD}</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-1">Total P&L</p>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">0%</span>
              <span className="text-sm text-gray-400 ml-2">$0</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Realized P&L</p>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-white">{copyStats.realizedPnL.sol} SOL</span>
              <span className="text-sm text-gray-400 ml-2">• {copyStats.realizedPnL.percentage}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-1">Unrealized P&L</p>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-white">{copyStats.unrealizedPnL.sol} SOL</span>
              <span className="text-sm text-gray-400 ml-2">• {copyStats.unrealizedPnL.percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Trading History</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-full text-sm bg-purple-600 text-white">All</button>
            <button className="px-3 py-1 rounded-full text-sm text-gray-400 hover:text-white">Buy</button>
            <button className="px-3 py-1 rounded-full text-sm text-gray-400 hover:text-white">Sell</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400">
                <th className="pb-4">Token Details</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Avg. Price</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Date & Hash</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-t border-white/10">
                <td className="py-4">
                  <div>
                    <p className="text-white font-medium">$Tadpole</p>
                    <p className="text-gray-400">$Tadpole / SOL</p>
                    <p className="text-gray-400 font-mono text-xs">GD63t...QbPcC</p>
                  </div>
                </td>
                <td className="text-green-400">BUY</td>
                <td className="text-white">0.0569 SOL</td>
                <td className="text-white">1.045M</td>
                <td>
                  <p className="text-gray-400">15 Oct 2024, 10:51:12 AM</p>
                  <a href="#" className="text-purple-400 hover:text-purple-300 flex items-center mt-1">
                    Verify
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}