import React, { useState } from 'react';
import { AlertTriangle, Zap, Settings, Clock, Activity, Wallet } from 'lucide-react';

export default function Sniper() {
  const [config, setConfig] = useState({
    platforms: {
      raydium: true,
      pumpfun: false,
      orca: false
    },
    buyAmount: 0.1,
    maxBuyTax: 10,
    maxSellTax: 10,
    minLiquidity: 1000,
    minInitialMcap: 10000,
    maxInitialMcap: 1000000,
    buyDelay: 0,
    antiBot: true,
    autoSell: true,
    takeProfit: 100,
    stopLoss: 20,
    maxWalletSize: 4,
    blacklistTokens: true,
    liquidityLock: {
      required: true,
      minLockTime: 30
    },
    contractVerification: {
      required: true,
      checkSourceCode: true
    },
    priorityFeeMode: 'auto' as 'auto' | 'manual' | 'turbo',
    customPriorityFee: 0.001,
    briberyAmount: 0.001
  });

  return (
    <div className="space-y-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Token Sniper Configuration</h2>

        {/* Platforms */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Platforms</label>
          <div className="flex flex-wrap gap-4">
            {Object.entries(config.platforms).map(([platform, isSelected]) => (
              <button
                key={platform}
                onClick={() => setConfig(prev => ({
                  ...prev,
                  platforms: {
                    ...prev.platforms,
                    [platform]: !isSelected
                  }
                }))}
                className={`px-4 py-2 rounded-lg bg-white/5 border transition-colors ${
                  isSelected
                    ? 'border-purple-500 text-purple-400'
                    : 'border-white/10 text-gray-400'
                }`}
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
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
              value={config.buyAmount}
              onChange={(e) => setConfig(prev => ({ ...prev, buyAmount: Number(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              step="0.1"
              min="0.1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Buy Delay (ms)</label>
            <input
              type="number"
              value={config.buyDelay}
              onChange={(e) => setConfig(prev => ({ ...prev, buyDelay: Number(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
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
              value={config.minLiquidity}
              onChange={(e) => setConfig(prev => ({ ...prev, minLiquidity: Number(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Initial Market Cap Range (USD)</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={config.minInitialMcap}
                onChange={(e) => setConfig(prev => ({ ...prev, minInitialMcap: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="Min"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={config.maxInitialMcap}
                onChange={(e) => setConfig(prev => ({ ...prev, maxInitialMcap: Number(e.target.value) }))}
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
                value={config.maxBuyTax}
                onChange={(e) => setConfig(prev => ({ ...prev, maxBuyTax: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Sell Tax (%)</label>
              <input
                type="number"
                value={config.maxSellTax}
                onChange={(e) => setConfig(prev => ({ ...prev, maxSellTax: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Anti-Bot Protection</span>
              <button
                onClick={() => setConfig(prev => ({ ...prev, antiBot: !prev.antiBot }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.antiBot ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.antiBot ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Blacklist Known Scam Tokens</span>
              <button
                onClick={() => setConfig(prev => ({ ...prev, blacklistTokens: !prev.blacklistTokens }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.blacklistTokens ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.blacklistTokens ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Verify Contract Source Code</span>
              <button
                onClick={() => setConfig(prev => ({
                  ...prev,
                  contractVerification: {
                    ...prev.contractVerification,
                    required: !prev.contractVerification.required
                  }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.contractVerification.required ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.contractVerification.required ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
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
            <button
              onClick={() => setConfig(prev => ({ ...prev, autoSell: !prev.autoSell }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.autoSell ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.autoSell ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {config.autoSell && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Take Profit (%)</label>
                <input
                  type="number"
                  value={config.takeProfit}
                  onChange={(e) => setConfig(prev => ({ ...prev, takeProfit: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
                <input
                  type="number"
                  value={config.stopLoss}
                  onChange={(e) => setConfig(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Priority Fee Settings */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Priority Fee Settings</h3>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setConfig(prev => ({ ...prev, priorityFeeMode: 'auto' }))}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                config.priorityFeeMode === 'auto'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-white/10 text-gray-400'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => setConfig(prev => ({ ...prev, priorityFeeMode: 'manual' }))}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                config.priorityFeeMode === 'manual'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-white/10 text-gray-400'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setConfig(prev => ({ ...prev, priorityFeeMode: 'turbo' }))}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                config.priorityFeeMode === 'turbo'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-white/10 text-gray-400'
              }`}
            >
              Turbo
            </button>
          </div>

          {config.priorityFeeMode === 'manual' && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Custom Priority Fee (SOL)</label>
              <input
                type="number"
                value={config.customPriorityFee}
                onChange={(e) => setConfig(prev => ({ ...prev, customPriorityFee: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                step="0.000001"
                min="0"
              />
            </div>
          )}

          {config.priorityFeeMode === 'turbo' && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bribery Amount (SOL)</label>
              <input
                type="number"
                value={config.briberyAmount}
                onChange={(e) => setConfig(prev => ({ ...prev, briberyAmount: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                step="0.000001"
                min="0"
              />
              <p className="text-sm text-yellow-400 mt-2">
                Warning: Bribery fees are non-refundable and may not guarantee transaction inclusion.
              </p>
            </div>
          )}
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