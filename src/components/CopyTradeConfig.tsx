import React, { useState } from 'react';
import { Coins, Settings, AlertTriangle, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface CopyTradeConfigProps {
  initialWalletAddress: string;
  onCopyTradeUpdate?: (walletAddress: string, isActive: boolean, tradeName: string) => void;
}

export default function CopyTradeConfig({ initialWalletAddress, onCopyTradeUpdate }: CopyTradeConfigProps) {
  const [config, setConfig] = useState({
    tradeName: '',
    walletAddress: initialWalletAddress,
    buyStrategy: 'exact' as 'exact' | 'percentage',
    minOrderSize: 0.001,
    totalAllocation: 0.01,
    platforms: {
      raydium: false,
      orca: false,
      pumpfun: false
    },
    stopLossPercentage: 0,
    exitStrategiesEnabled: true,
    exitStrategies: [{ profitPercentage: 100, sellPercentage: 20 }],
    isAdvancedOpen: false,
    isActive: false,
    minBuyThreshold: 0.001,
    maxTokenAmount: 1,
    priorityFeeMode: 'auto' as 'auto' | 'manual' | 'bribery',
    customPriorityFee: 0.001,
    briberyAmount: 0.001
  });

  const handleAddExitStrategy = () => {
    setConfig(prev => ({
      ...prev,
      exitStrategies: [
        ...prev.exitStrategies,
        { profitPercentage: prev.exitStrategies[prev.exitStrategies.length - 1].profitPercentage * 2, sellPercentage: 20 }
      ]
    }));
  };

  const handleRemoveExitStrategy = (index: number) => {
    setConfig(prev => ({
      ...prev,
      exitStrategies: prev.exitStrategies.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (onCopyTradeUpdate) {
      onCopyTradeUpdate(initialWalletAddress, config.isActive, config.tradeName);
    }
    alert('Configuration saved successfully!');
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Unique Copy Trade Name</label>
          <input
            type="text"
            value={config.tradeName}
            onChange={(e) => setConfig(prev => ({ ...prev, tradeName: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            placeholder="Enter a name for this copy trade"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Buy Strategy</label>
            <select
              value={config.buyStrategy}
              onChange={(e) => setConfig(prev => ({ ...prev, buyStrategy: e.target.value as 'exact' | 'percentage' }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            >
              <option value="exact">Buy exactly for</option>
              <option value="percentage">Buy in % of actual trade</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Minimum Order Size</label>
            <div className="relative">
              <input
                type="number"
                value={config.minOrderSize}
                onChange={(e) => setConfig(prev => ({ ...prev, minOrderSize: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                min="0.001"
                step="0.001"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">SOL</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 0.001 per order</p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Total SOL to Allocate</label>
          <div className="relative">
            <input
              type="number"
              value={config.totalAllocation}
              onChange={(e) => setConfig(prev => ({ ...prev, totalAllocation: Number(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              min="0.01"
              step="0.01"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">SOL</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Min 0.01 SOL</p>
        </div>

        <div>
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
                className={`px-4 py-2 rounded-lg border ${
                  isSelected
                    ? 'border-purple-500 text-purple-400 bg-white/5'
                    : 'border-white/10 text-gray-400 bg-white/5'
                }`}
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Stop Loss Trigger %</label>
          <div className="relative">
            <input
              type="number"
              value={config.stopLossPercentage}
              onChange={(e) => setConfig(prev => ({ ...prev, stopLossPercentage: Number(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              placeholder="e.g. 0 - 100%"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-gray-400">Manual exit / sell strategy</label>
            <button
              onClick={() => setConfig(prev => ({ ...prev, exitStrategiesEnabled: !prev.exitStrategiesEnabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.exitStrategiesEnabled ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.exitStrategiesEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {config.exitStrategiesEnabled && (
            <>
              <p className="text-sm text-gray-400 mb-4">
                Set the manual sell & profit percentages. Token will be sold automatically on meeting this criteria
              </p>

              {config.exitStrategies.map((strategy, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">% to Sell</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={strategy.sellPercentage}
                        onChange={(e) => {
                          const newStrategies = [...config.exitStrategies];
                          newStrategies[index].sellPercentage = Number(e.target.value);
                          setConfig(prev => ({ ...prev, exitStrategies: newStrategies }));
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">@ Profit</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={strategy.profitPercentage}
                        onChange={(e) => {
                          const newStrategies = [...config.exitStrategies];
                          newStrategies[index].profitPercentage = Number(e.target.value);
                          setConfig(prev => ({ ...prev, exitStrategies: newStrategies }));
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</div>
                    </div>
                  </div>

                  {index > 0 && (
                    <button
                      onClick={() => handleRemoveExitStrategy(index)}
                      className="mt-6 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddExitStrategy}
                className="flex items-center text-purple-400 hover:text-purple-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add one more exit
              </button>
            </>
          )}
        </div>

        <div>
          <button
            onClick={() => setConfig(prev => ({ ...prev, isAdvancedOpen: !prev.isAdvancedOpen }))}
            className="flex items-center justify-between w-full text-left"
          >
            <div>
              <h3 className="text-white font-medium">Advanced Settings</h3>
              <p className="text-sm text-gray-400">Set buy thresholds, max. token amount, fees & more...</p>
            </div>
            {config.isAdvancedOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {config.isAdvancedOpen && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Min. Buy Threshold</label>
                <div className="relative">
                  <input
                    type="number"
                    value={config.minBuyThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, minBuyThreshold: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="e.g. 0.001"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">SOL</div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Token Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={config.maxTokenAmount}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxTokenAmount: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="e.g. 1"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">SOL</div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Priority Fee</label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, priorityFeeMode: 'auto' }))}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        config.priorityFeeMode === 'auto'
                          ? 'border-purple-500 text-purple-400'
                          : 'border-white/10 text-gray-400'
                      }`}
                    >
                      Auto (Recommended)
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
                      onClick={() => setConfig(prev => ({ ...prev, priorityFeeMode: 'bribery' }))}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        config.priorityFeeMode === 'bribery'
                          ? 'border-purple-500 text-purple-400'
                          : 'border-white/10 text-gray-400'
                      }`}
                    >
                      Bribery
                    </button>
                  </div>

                  {config.priorityFeeMode === 'manual' && (
                    <div className="relative">
                      <input
                        type="number"
                        value={config.customPriorityFee}
                        onChange={(e) => setConfig(prev => ({ ...prev, customPriorityFee: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                        placeholder="Enter custom priority fee"
                        step="0.000001"
                        min="0"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">SOL</div>
                    </div>
                  )}

                  {config.priorityFeeMode === 'bribery' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="number"
                          value={config.briberyAmount}
                          onChange={(e) => setConfig(prev => ({ ...prev, briberyAmount: Number(e.target.value) }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                          placeholder="Enter bribery amount"
                          step="0.000001"
                          min="0"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">SOL</div>
                      </div>
                      <p className="text-sm text-yellow-400">
                        Warning: Bribery fees are non-refundable and may not guarantee transaction inclusion.
                      </p>
                    </div>
                  )}

                  {config.priorityFeeMode === 'auto' && (
                    <p className="text-sm text-gray-400">
                      Priority fees will be automatically adjusted based on network conditions to ensure optimal execution.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <span className="text-gray-400">Activate Copy Trading</span>
          <button
            onClick={() => setConfig(prev => ({ ...prev, isActive: !prev.isActive }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.isActive ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}