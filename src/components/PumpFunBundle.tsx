import React, { useState } from 'react';
import { Upload, Plus, ArrowRight, LineChart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PumpFunBundle() {
  const [step, setStep] = useState<'create' | 'simulate'>('create');
  const [config, setConfig] = useState({
    name: '',
    symbol: '',
    logo: null as File | null,
    description: '',
    initialSupply: 1000000,
    website: '',
    twitter: '',
    telegram: '',
    walletCount: 100,
    simulationHours: 24,
    buyPressure: 60,
    sellPressure: 40,
    dumpPercentage: 80,
    dumpTriggerPrice: 0.001
  });

  const [priceData, setPriceData] = useState<number[]>([]);
  const [volumeData, setVolumeData] = useState<number[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setConfig(prev => ({ ...prev, logo: file }));
    }
  };

  const generateSimulationData = () => {
    const prices: number[] = [];
    const volumes: number[] = [];
    let currentPrice = 0.0001;
    
    for (let i = 0; i < config.simulationHours; i++) {
      const buyPressureMultiplier = config.buyPressure / 100;
      const randomFactor = Math.random() * 0.2 - 0.1;
      
      if (currentPrice >= config.dumpTriggerPrice) {
        currentPrice *= (1 - (config.dumpPercentage / 100));
      } else {
        currentPrice *= (1 + (buyPressureMultiplier * 0.1) + randomFactor);
      }
      
      const volume = Math.floor(Math.random() * 1000000 * buyPressureMultiplier);
      
      prices.push(currentPrice);
      volumes.push(volume);
    }
    
    setPriceData(prices);
    setVolumeData(volumes);
  };

  const chartData = {
    labels: Array.from({ length: config.simulationHours }, (_, i) => `${i}h`),
    datasets: [
      {
        label: 'Price',
        data: priceData,
        borderColor: 'rgb(147, 51, 234)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Volume',
        data: volumeData,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
        fill: false,
        hidden: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgb(209, 213, 219)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgb(209, 213, 219)'
        }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {step === 'create' ? (
        <div className="space-y-8">
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Token Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Token Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  placeholder="Enter token name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Token Symbol</label>
                <input
                  type="text"
                  value={config.symbol}
                  onChange={(e) => setConfig(prev => ({ ...prev, symbol: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  placeholder="Enter token symbol"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-gray-400 mb-2">Token Logo</label>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-gray-400">Click to upload logo</span>
                  <span className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-gray-400 mb-2">Token Description</label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white h-32"
                placeholder="Enter token description"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Website</label>
                <input
                  type="url"
                  value={config.website}
                  onChange={(e) => setConfig(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Twitter</label>
                <input
                  type="text"
                  value={config.twitter}
                  onChange={(e) => setConfig(prev => ({ ...prev, twitter: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Telegram</label>
                <input
                  type="text"
                  value={config.telegram}
                  onChange={(e) => setConfig(prev => ({ ...prev, telegram: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  placeholder="t.me/"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setStep('simulate');
                  generateSimulationData();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                Continue to Simulation
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Market Simulation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Buy Pressure (%)</label>
                <input
                  type="number"
                  value={config.buyPressure}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, buyPressure: Number(e.target.value) }));
                    generateSimulationData();
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Sell Pressure (%)</label>
                <input
                  type="number"
                  value={config.sellPressure}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, sellPressure: Number(e.target.value) }));
                    generateSimulationData();
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Dump Trigger Price ($)</label>
                <input
                  type="number"
                  value={config.dumpTriggerPrice}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, dumpTriggerPrice: Number(e.target.value) }));
                    generateSimulationData();
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  step="0.0001"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Dump Percentage (%)</label>
                <input
                  type="number"
                  value={config.dumpPercentage}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, dumpPercentage: Number(e.target.value) }));
                    generateSimulationData();
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="h-96 mb-8">
              <Line data={chartData} options={chartOptions} />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('create')}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                Back to Configuration
              </button>

              <button
                onClick={() => {/* Handle token creation */}}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                Create Token
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}