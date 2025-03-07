import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, LineChart, History, Award, Zap, ChevronDown, Clock } from 'lucide-react';
import { useCopyTrading } from '../hooks/useCopyTrading';
import { useWallet } from '../hooks/useWallet';

export default function Dashboard() {
  const { activeTraders, isLoading } = useCopyTrading();
  const { balance } = useWallet();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 12435.89,
    totalPnL: 2341.23,
    pnlPercentage: 23.5,
    totalTrades: 156,
    winRate: 72.4,
    avgROI: 18.9,
    bestTrade: 456.78,
    worstTrade: -123.45,
    activeStrategies: 5,
    averageExecution: 234 // ms
  });

  const [strategyPerformance, setStrategyPerformance] = useState([
    {
      name: "Strategy 1",
      type: "Copy Trading",
      roi: 34.5,
      winRate: 78.2,
      trades: 45,
      status: "active"
    },
    {
      name: "Strategy 2",
      type: "Manual Trading",
      roi: 22.1,
      winRate: 65.8,
      trades: 32,
      status: "active"
    }
  ]);

  const recentTrades = [
    {
      token: "SOL/USDC",
      type: "buy",
      amount: "123.45",
      price: "89.32",
      pnl: "+12.3%",
      time: "2h ago",
      strategy: "Copy Trading",
      executionTime: "234ms"
    }
  ];

  useEffect(() => {
    // Mettre à jour les statistiques en temps réel
    const updateStats = async () => {
      // Logique de mise à jour des stats
    };

    const interval = setInterval(updateStats, 30000); // Mise à jour toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Portfolio Value</p>
            <Wallet className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">${portfolioStats.totalValue.toLocaleString()}</p>
          <div className="flex items-center mt-2 text-green-400">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>+${portfolioStats.totalPnL.toLocaleString()} ({portfolioStats.pnlPercentage}%)</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Total Trades</p>
            <History className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{portfolioStats.totalTrades}</p>
          <p className="text-gray-400 mt-2">Win Rate: {portfolioStats.winRate}%</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Average ROI</p>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{portfolioStats.avgROI}%</p>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-green-400">Best: +{portfolioStats.bestTrade}%</span>
            <span className="text-red-400">Worst: {portfolioStats.worstTrade}%</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Active Strategies</p>
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{portfolioStats.activeStrategies}</p>
          <button className="text-purple-400 text-sm mt-2 hover:text-purple-300">
            Manage Strategies →
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Average Execution</p>
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{portfolioStats.averageExecution}ms</p>
          <div className="flex items-center mt-2 text-purple-400">
            <Zap className="h-4 w-4 mr-1" />
            <span>Via Jito Relay</span>
          </div>
        </div>
      </div>

      {/* Performance des Stratégies */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Strategy Performance</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-lg text-sm bg-purple-600 text-white">1D</button>
            <button className="px-3 py-1 rounded-lg text-sm text-gray-400 hover:text-white">1W</button>
            <button className="px-3 py-1 rounded-lg text-sm text-gray-400 hover:text-white">1M</button>
            <button className="px-3 py-1 rounded-lg text-sm text-gray-400 hover:text-white">1Y</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strategyPerformance.map((strategy, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">{strategy.name}</h3>
                  <p className="text-sm text-gray-400">{strategy.type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  strategy.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {strategy.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">ROI</p>
                  <p className="text-lg font-bold text-white">{strategy.roi}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Win Rate</p>
                  <p className="text-lg font-bold text-white">{strategy.winRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Trades</p>
                  <p className="text-lg font-bold text-white">{strategy.trades}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique de Performance */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Portfolio Performance</h2>
          <div className="flex space-x-2">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
            >
              <option value="1D">1 Day</option>
              <option value="1W">1 Week</option>
              <option value="1M">1 Month</option>
              <option value="1Y">1 Year</option>
            </select>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <LineChart className="h-8 w-8" />
        </div>
      </div>

      {/* Activité Récente */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentTrades.map((trade, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  trade.type === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  {trade.type === 'buy' ? (
                    <ArrowUpRight className={`h-5 w-5 ${
                      trade.type === 'buy' ? 'text-green-500' : 'text-red-500'
                    }`} />
                  ) : (
                    <ArrowDownRight className={`h-5 w-5 ${
                      trade.type === 'buy' ? 'text-green-500' : 'text-red-500'
                    }`} />
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="text-white font-medium">{trade.token}</p>
                    <span className="text-xs text-gray-400 ml-2">via {trade.strategy}</span>
                  </div>
                  <p className="text-sm text-gray-400">{trade.amount} @ ${trade.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  trade.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>{trade.pnl}</p>
                <p className="text-sm text-gray-400">{trade.time}</p>
                <p className="text-xs text-purple-400">Execution: {trade.executionTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}