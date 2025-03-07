import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, Star, ArrowUp, ArrowDown } from 'lucide-react';

interface TraderRanking {
  rank: number;
  name: string;
  walletAddress: string;
  reputation: number;
  roi: number;
  followers: number;
  weeklyChange: number;
  strategyCount: number;
}

export default function TraderRankings() {
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m' | 'all'>('1w');
  const [sortBy, setSortBy] = useState<'reputation' | 'roi' | 'followers'>('reputation');

  const rankings: TraderRanking[] = [
    {
      rank: 1,
      name: "Whale Master",
      walletAddress: "7nYB8ELLNCwmMQ5UKqH6qYaP6qkUJsGHvGKPvtZHD8L1",
      reputation: 98,
      roi: 156.4,
      followers: 1234,
      weeklyChange: 2,
      strategyCount: 5
    },
    {
      rank: 2,
      name: "SOL Sage",
      walletAddress: "3xB9L4o5sVNnqgCLZCzyzPVh9BKcEsKUHsNvCm7Hdb4C",
      reputation: 95,
      roi: 142.8,
      followers: 892,
      weeklyChange: -1,
      strategyCount: 3
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 text-yellow-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Top Traders</h2>
        </div>

        <div className="flex space-x-4">
          <div className="bg-white/5 rounded-lg p-1">
            {(['1d', '1w', '1m', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  timeframe === t
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="reputation">Reputation</option>
            <option value="roi">ROI</option>
            <option value="followers">Followers</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {rankings.map((trader) => (
          <div
            key={trader.rank}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  trader.rank === 1 ? 'bg-yellow-500' :
                  trader.rank === 2 ? 'bg-gray-400' :
                  trader.rank === 3 ? 'bg-amber-600' :
                  'bg-white/10'
                }`}>
                  <span className="text-white font-bold">{trader.rank}</span>
                </div>

                <div>
                  <h3 className="text-white font-medium">{trader.name}</h3>
                  <p className="text-sm text-gray-400 font-mono">{`${trader.walletAddress.slice(0, 4)}...${trader.walletAddress.slice(-4)}`}</p>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="flex items-center text-purple-400 mb-1">
                    <Star className="h-4 w-4 mr-1" />
                    <span>{trader.reputation}</span>
                  </div>
                  <p className="text-xs text-gray-400">Reputation</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-green-400 mb-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{trader.roi}%</span>
                  </div>
                  <p className="text-xs text-gray-400">ROI</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-blue-400 mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{trader.followers}</span>
                  </div>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center mb-1">
                    {trader.weeklyChange > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                    )}
                    <span className={trader.weeklyChange > 0 ? 'text-green-400' : 'text-red-400'}>
                      {Math.abs(trader.weeklyChange)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Weekly Δ</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}