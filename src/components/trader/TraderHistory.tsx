import React from 'react';
import { History } from 'lucide-react';

export default function TraderHistory() {
  const recentTrades = [
    { token: "SOL/USDC", type: "Buy", amount: "12.5 SOL", price: "$102.45", time: "2m ago" },
    { token: "BONK/USDC", type: "Sell", amount: "1.2M BONK", price: "$0.00001234", time: "15m ago" },
    { token: "JTO/USDC", type: "Buy", amount: "145 JTO", price: "$3.21", time: "1h ago" },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <div className="flex items-center mb-6">
        <History className="h-5 w-5 text-blue-400 mr-2" />
        <h2 className="text-xl font-bold text-white">Recent Trades</h2>
      </div>

      <div className="space-y-4">
        {recentTrades.map((trade, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{trade.token}</span>
              <span className={`text-sm ${
                trade.type === "Buy" ? "text-green-400" : "text-red-400"
              }`}>{trade.type}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{trade.amount}</span>
              <span className="text-gray-400">{trade.price}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">{trade.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}