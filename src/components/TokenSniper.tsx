import React from 'react';
import { AlertTriangle, Zap, Settings, Clock, Activity, Wallet } from 'lucide-react';

export default function TokenSniper() {
  return (
    <div className="space-y-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Token Sniper Configuration</h2>

        {/* Platforms */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Platforms</label>
          <div className="flex flex-wrap gap-4">
            {['Raydium', 'Orca', 'PumpFun'].map((platform) => (
              <button
                key={platform}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Buy Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Buy Amount (SOL)</label>
            <input
              type="number"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              placeholder="0.1"
              step="0.1"
              min="0.1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Buy Delay (ms)</label>
            <input
              type="number"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              placeholder="0"
              step="100"
              min="0"
            />
          </div>
        </div>

        {/* Liquidity & Market Cap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Min Liquidity (USD)</label>
            <input
              type="number"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Initial Market Cap Range (USD)</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="Min"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Anti-Rug Protection */}
        <div className="space-y-6 mb-6">
          <h3 className="text-lg font-semibold text-white">Anti-Rug Protection</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Buy Tax (%)</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Sell Tax (%)</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Anti-Bot Protection</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Blacklist Known Scam Tokens</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Verify Contract Source Code</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Auto Sell Configuration */}
        <div className="space-y-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Auto Sell Configuration</h3>
              <p className="text-sm text-gray-400">Configure automatic profit taking and stop loss</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Take Profit (%)</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="20"
              />
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-500/10 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
            <p className="text-yellow-500 text-sm">
              Token sniping involves high risk. Always verify contracts and invest responsibly. Anti-rug protection helps minimize risk but cannot guarantee safety.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
          <Zap className="h-5 w-5 mr-2" />
          Start Sniping
        </button>
      </div>
    </div>
  );
}