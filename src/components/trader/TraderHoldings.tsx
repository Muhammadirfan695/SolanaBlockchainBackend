import React from 'react';
import { Coins } from 'lucide-react';

export default function TraderHoldings() {
  const holdings = [
    { token: "SOL", amount: "145.32", value: "$14,532" },
    { token: "BONK", amount: "12.5M", value: "$1,250" },
    { token: "JTO", amount: "1,234", value: "$3,702" },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <div className="flex items-center mb-6">
        <Coins className="h-5 w-5 text-yellow-400 mr-2" />
        <h2 className="text-xl font-bold text-white">Token Holdings</h2>
      </div>

      <div className="space-y-4">
        {holdings.map((token, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center">
                {token.token.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{token.token}</p>
                <p className="text-sm text-gray-400">{token.amount}</p>
              </div>
            </div>
            <p className="text-white font-medium">{token.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}