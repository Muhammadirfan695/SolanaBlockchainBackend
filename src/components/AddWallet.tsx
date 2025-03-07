import React, { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import CopyTradeConfig from './CopyTradeConfig';

export default function AddWallet() {
  const [walletAddress, setWalletAddress] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  if (showConfig) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setShowConfig(false)}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <ArrowRight className="h-5 w-5 mr-2 transform rotate-180" />
          Back to Dashboard
        </button>
        <CopyTradeConfig initialWalletAddress={walletAddress} />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress.trim()) {
      setShowConfig(true);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Add Wallet to Copy</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter Solana wallet address to copy..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
        <button 
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Configure Wallet
        </button>
      </form>
    </div>
  );
}