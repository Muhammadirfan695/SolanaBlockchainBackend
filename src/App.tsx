import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TraderCard from './components/TraderCard';
import AddWallet from './components/AddWallet';
import TrackWallets from './components/TrackWallets';
import Dashboard from './components/Dashboard';
import NFTAccess from './components/NFTAccess';
import TransferFunds from './components/TransferFunds';
import MEVDashboard from './components/MEVDashboard';
import TokenSniper from './components/TokenSniper';
import TelegramCopy from './components/TelegramCopy';
import PumpFunBundle from './components/PumpFunBundle';
import { useWallet } from './hooks/useWallet';
import TraderConfig from './components/TraderConfig';

function App() {
  const [selectedTrader, setSelectedTrader] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'copytraders' | 'tracking' | 'mev' | 'sniper' | 'telegram' | 'bundle'>('copytraders');
  const [currentPage, setCurrentPage] = useState<'main' | 'transfer' | 'dashboard' | 'nft'>('main');
  const { connect, connected, connecting } = useWallet();

  const [wallets, setWallets] = useState([
    {
      name: "Top Trader",
      walletAddress: "7nYB8ELLNCwmMQ5UKqH6qYaP6qkUJsGHvGKPvtZHD8L1",
      roi: 156,
      pnlPercentage: 23.5,
      solanaInvested: 1250,
      copyStatus: {
        isActive: false,
        tradeName: ""
      }
    },
    {
      name: "SOL Whale",
      walletAddress: "3xB9L4o5sVNnqgCLZCzyzPVh9BKcEsKUHsNvCm7Hdb4C",
      roi: 142,
      pnlPercentage: -5.2,
      solanaInvested: 3400,
      copyStatus: {
        isActive: false,
        tradeName: ""
      }
    }
  ]);

  const handleConfigUpdate = (index: number, isActive: boolean, tradeName: string) => {
    setWallets(prev => prev.map((wallet, i) => 
      i === index 
        ? { 
            ...wallet, 
            copyStatus: { isActive, tradeName }
          }
        : wallet
    ));
    setSelectedTrader(null);
  };

  const renderContent = () => {
    if (currentPage === 'transfer') return <TransferFunds />;
    if (currentPage === 'dashboard') return <Dashboard />;
    if (currentPage === 'nft') return <NFTAccess />;

    if (selectedTrader !== null) {
      return (
        <TraderConfig
          trader={wallets[selectedTrader]}
          onBack={() => setSelectedTrader(null)}
          onConfigUpdate={(isActive, tradeName) => handleConfigUpdate(selectedTrader, isActive, tradeName)}
        />
      );
    }

    switch (activeView) {
      case 'copytraders':
        return (
          <>
            <AddWallet />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wallets.map((wallet, index) => (
                <TraderCard 
                  key={index} 
                  {...wallet} 
                  onClick={() => setSelectedTrader(index)}
                  onDeactivate={() => handleConfigUpdate(index, false, "")}
                />
              ))}
            </div>
          </>
        );
      case 'tracking':
        return <TrackWallets />;
      case 'mev':
        return <MEVDashboard />;
      case 'sniper':
        return <TokenSniper />;
      case 'telegram':
        return <TelegramCopy />;
      case 'bundle':
        return <PumpFunBundle />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Navbar 
        activeView={activeView}
        onViewChange={setActiveView}
        onPageChange={setCurrentPage}
      />
      <main className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {activeView === 'copytraders' && 'Copy Trading'}
              {activeView === 'tracking' && 'Track Wallets'}
              {activeView === 'mev' && 'MEV Trading Suite'}
              {activeView === 'sniper' && 'Token Sniper'}
              {activeView === 'telegram' && 'Telegram Copy'}
              {activeView === 'bundle' && 'PumpFun Bundle'}
            </h1>
            {activeView === 'copytraders' && !selectedTrader && (
              <p className="text-gray-400">
                Copy Top Solana Whales<br />
                Track and copy successful Solana wallets automatically. Monitor ROI, PNL, and investment amounts in real-time.
              </p>
            )}
          </div>

          {!selectedTrader && (
            <div className="flex justify-center mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-1 inline-flex">
                <button
                  onClick={() => setActiveView('copytraders')}
                  className={`px-6 py-2 rounded-md transition-all ${
                    activeView === 'copytraders' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Copy Trading
                </button>
                <button
                  onClick={() => setActiveView('tracking')}
                  className={`px-6 py-2 rounded-md transition-all ${
                    activeView === 'tracking' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Track Wallets
                </button>
                <button
                  onClick={() => setActiveView('mev')}
                  className={`px-6 py-2 rounded-md transition-all ${
                    activeView === 'mev' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  MEV Trading
                </button>
                <button
                  onClick={() => setActiveView('sniper')}
                  className={`px-6 py-2 rounded-md transition-all ${
                    activeView === 'sniper' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Token Sniper
                </button>
                <button
                  onClick={() => setActiveView('telegram')}
                  className={`px-6 py-2 rounded-md transition-all ${
                    activeView === 'telegram' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Telegram Copy
                </button>
                <button
                  onClick={() => setActiveView('bundle')}
                  className={`px-6 py-2 rounded-md transition-all ${
                    activeView === 'bundle' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  PumpFun Bundle
                </button>
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;