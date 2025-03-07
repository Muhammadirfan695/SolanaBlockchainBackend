import React, { useState } from 'react';
import { Search, TrendingUp, Clock, Plus, ArrowRight, ExternalLink, LineChart } from 'lucide-react';
import TokenRankings from './TokenRankings';
import CopyAddress from './CopyAddress';

interface Token {
  name: string;
  pair: string;
  address: string;
  liquidity: string;
  marketCap: string;
  volume: string;
  priceChanges: {
    '1m': string;
    '5m': string;
    '30m': string;
    '1h': string;
  };
}

export default function TrackWallets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '5m' | '30m' | '1h'>('1h');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'trending' | 'new'>('trending');

  const trendingTokens: Token[] = [
    {
      name: "$HONEY",
      pair: "SOL",
      address: "2qEH...pump",
      liquidity: "23K",
      marketCap: "$7,869",
      volume: "$109K",
      priceChanges: {
        '1m': "1.23%",
        '5m': "2.33%",
        '30m': "0.69%",
        '1h': "-1.24%"
      }
    }
  ];

  const TokenRow = ({ token }: { token: Token }) => (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{token.name}</h3>
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
              {token.pair}
            </span>
          </div>
          <CopyAddress address={token.address} className="text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Market Cap</p>
          <p className="text-lg font-bold text-white">{token.marketCap}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Liquidity</p>
          <p className="text-lg font-bold text-white">{token.liquidity}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Volume (24h)</p>
          <p className="text-lg font-bold text-white">{token.volume}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {Object.entries(token.priceChanges).map(([timeframe, change]) => (
            <div
              key={timeframe}
              className={`px-3 py-1 rounded-lg text-sm ${
                parseFloat(change) >= 0
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {timeframe}: {change}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedToken(token.address)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            Track
            <LineChart className="h-4 w-4 ml-2" />
          </button>
          <a
            href={`https://birdeye.so/token/${token.address}?chain=solana`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center"
          >
            Details
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {selectedToken ? (
        <>
          <button
            onClick={() => setSelectedToken(null)}
            className="flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowRight className="h-5 w-5 mr-2 transform rotate-180" />
            Back to Tokens
          </button>
          <TokenRankings tokenAddress={selectedToken} />
        </>
      ) : (
        <>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by token name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors whitespace-nowrap">
                <Plus className="h-5 w-5 mr-2" />
                Add Custom Token
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setViewMode('trending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'trending'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Trending Tokens
                </button>
                <button
                  onClick={() => setViewMode('new')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'new'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  New Tokens
                </button>
              </div>
              <div className="flex items-center space-x-2">
                {(['1m', '5m', '30m', '1h'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      selectedTimeframe === period
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {trendingTokens.map((token, index) => (
              <TokenRow key={index} token={token} />
            ))}
          </div>

          <div className="flex justify-center">
            <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center">
              Load More Tokens
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}