import React, { useState } from 'react';
import { Zap, TrendingUp, ArrowUpRight, Clock, AlertTriangle, Settings, Activity } from 'lucide-react';

export default function MEVDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [mevStats, setMevStats] = useState({
    totalValue: 892.45,
    totalPnL: 234.12,
    pnlPercentage: 26.2,
    totalOpportunities: 89,
    successRate: 82.5,
    avgROI: 12.4,
    bestTrade: 89.32,
    worstTrade: -12.45,
    averageExecution: 156 // ms
  });

  const recentMEVs = [
    {
      type: "Sandwich Attack",
      token: "SOL/USDC",
      profit: "+1.23 SOL",
      time: "2m ago",
      executionTime: "156ms",
      status: "success"
    },
    {
      type: "Arbitrage",
      token: "BONK/SOL",
      profit: "+0.45 SOL",
      time: "5m ago",
      executionTime: "189ms",
      status: "success"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">MEV Trading Suite</h1>
        <p className="text-gray-400">Advanced arbitrage and sandwich attack opportunities</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Total Value Extracted</p>
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">${mevStats.totalValue.toLocaleString()}</p>
          <div className="flex items-center mt-2 text-green-400">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>+${mevStats.totalPnL} ({mevStats.pnlPercentage}%)</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Success Rate</p>
            <Activity className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{mevStats.successRate}%</p>
          <p className="text-gray-400 mt-2">{mevStats.totalOpportunities} opportunities</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Average ROI</p>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{mevStats.avgROI}%</p>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-green-400">Best: +{mevStats.bestTrade}%</span>
            <span className="text-red-400">Worst: {mevStats.worstTrade}%</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Average Execution</p>
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{mevStats.averageExecution}ms</p>
          <div className="flex items-center mt-2 text-purple-400">
            <Zap className="h-4 w-4 mr-1" />
            <span>Via Jito Relay</span>
          </div>
        </div>
      </div>

      {/* MEV Settings */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-purple-400 mr-2" />
            <h2 className="text-xl font-bold text-white">MEV Strategy Settings</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Minimum Profit Threshold</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="0.01 SOL"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Maximum Gas Price</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="Enter gas price in SOL"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Strategy Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white">
                <option value="both">Both (Arbitrage & Sandwich)</option>
                <option value="arbitrage">Arbitrage Only</option>
                <option value="sandwich">Sandwich Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Execution Speed</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white">
                <option value="ultra">Ultra (150-200ms)</option>
                <option value="fast">Fast (200-300ms)</option>
                <option value="normal">Normal (300-500ms)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center text-yellow-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span className="text-sm">High-risk strategy. Use with caution.</span>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
            Update Strategy
          </button>
        </div>
      </div>

      {/* Recent MEV Activity */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Recent MEV Activity</h2>
        <div className="space-y-4">
          {recentMEVs.map((mev, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="text-white font-medium">{mev.type}</p>
                    <span className="text-xs text-gray-400 ml-2">{mev.token}</span>
                  </div>
                  <p className="text-sm text-gray-400">{mev.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-medium">{mev.profit}</p>
                <p className="text-xs text-purple-400">Execution: {mev.executionTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}