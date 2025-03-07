import React, { useState } from 'react';
import { Wallet, Coins, ArrowRight, Flame, Shield, Zap, Trophy } from 'lucide-react';

interface NFTTier {
  id: number;
  name: string;
  price: number;
  burnAmount: number;
  icon: React.ReactNode;
  benefits: string[];
}

export default function NFTAccess() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const tiers: NFTTier[] = [
    {
      id: 1,
      name: "Whale Scout",
      price: 1.5,
      burnAmount: 15000,
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      benefits: [
        "Basic copy trading access",
        "Up to 3 active strategies",
        "Standard execution speed",
        "Basic analytics"
      ]
    },
    {
      id: 2,
      name: "Whale Hunter",
      price: 3,
      burnAmount: 30000,
      icon: <Zap className="h-8 w-8 text-purple-400" />,
      benefits: [
        "Premium copy trading access",
        "Up to 10 active strategies",
        "Priority execution",
        "Advanced analytics",
        "Early access to new features"
      ]
    },
    {
      id: 3,
      name: "Whale Master",
      price: 5,
      burnAmount: 50000,
      icon: <Trophy className="h-8 w-8 text-yellow-400" />,
      benefits: [
        "Ultimate copy trading access",
        "Unlimited active strategies",
        "Instant execution",
        "Professional analytics suite",
        "Private Discord channel",
        "1-on-1 strategy consultation"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">WhalesX NFT Access</h1>
        <p className="text-gray-400 text-lg">
          Burn WhalesX tokens to mint exclusive NFTs and unlock premium features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
              selectedTier === tier.id
                ? 'border-purple-500 transform scale-105'
                : 'border-white/10 hover:border-purple-500/50'
            }`}
            onClick={() => setSelectedTier(tier.id)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="text-sm text-gray-400">Tier {tier.id}</p>
              </div>
              {tier.icon}
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-400">Price</p>
                <p className="text-2xl font-bold text-white">{tier.price} SOL</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-400">Token Burn</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-white">{tier.burnAmount.toLocaleString()}</p>
                  <Flame className="h-5 w-5 text-red-400 ml-2" />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {tier.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <ArrowRight className="h-4 w-4 text-purple-400 mr-2" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedTier === tier.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Select & Mint
            </button>
          </div>
        ))}
      </div>

      {selectedTier && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Token Swap & Burn</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-400">You will pay</p>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-sm text-gray-400">Balance: 100,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={tiers[selectedTier - 1].burnAmount}
                    readOnly
                    className="bg-transparent text-2xl font-bold text-white outline-none"
                  />
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">WhalesX</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-400">You will receive</p>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">NFT Tier</span>
                  <span className="text-sm text-purple-400">Max 1 per wallet</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {tiers[selectedTier - 1].name}
                  </span>
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center">
              <Flame className="h-5 w-5 mr-2" />
              Burn & Mint NFT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}