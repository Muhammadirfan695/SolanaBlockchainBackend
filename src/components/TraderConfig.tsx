import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import TraderStats from './trader/TraderStats';
import TraderHoldings from './trader/TraderHoldings';
import TraderHistory from './trader/TraderHistory';
import CopyTradeConfig from './CopyTradeConfig';
import CopyAddress from './CopyAddress';

interface TraderConfigProps {
  trader: {
    name: string;
    walletAddress: string;
    roi: number;
    pnlPercentage: number;
    solanaInvested: number;
    copyStatus?: {
      isActive: boolean;
      tradeName: string;
    };
  };
  onBack: () => void;
  existingConfig?: {
    tradeName: string;
    isActive: boolean;
  };
  onConfigUpdate: (isActive: boolean, tradeName: string) => void;
}

export default function TraderConfig({ trader, onBack, existingConfig, onConfigUpdate }: TraderConfigProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'copy'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{trader.name}</h1>
          <CopyAddress address={trader.walletAddress} className="text-gray-400" />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('copy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'copy'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Copy Trading
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TraderStats trader={trader} />
          <TraderHoldings />
          <TraderHistory />
        </div>
      ) : (
        <CopyTradeConfig 
          initialWalletAddress={trader.walletAddress}
          existingConfig={trader.copyStatus}
          onCopyTradeUpdate={(isActive, tradeName) => onConfigUpdate(isActive, tradeName)}
        />
      )}
    </div>
  );
}