'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import TraderCard from '@/components/TraderCard';
import AddWallet from '@/components/AddWallet';
import TrackWallets from '@/components/TrackWallets';
import Dashboard from '@/components/Dashboard';
import NFTAccess from '@/components/NFTAccess';
import TransferFunds from '@/components/TransferFunds';
import MEVDashboard from '@/components/MEVDashboard';
import { useWallet } from '@/hooks/useWallet';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedTrader, setSelectedTrader] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'copytraders' | 'tracking' | 'mev'>('copytraders');
  const [currentPage, setCurrentPage] = useState<'main' | 'transfer' | 'dashboard' | 'nft'>('main');
  const { connect, connected, connecting } = useWallet();

  const wallets = [
    {
      name: "Top Trader",
      walletAddress: "7nYB8ELLNCwmMQ5UKqH6qYaP6qkUJsGHvGKPvtZHD8L1",
      roi: 156,
      pnlPercentage: 23.5,
      solanaInvested: 1250
    },
    {
      name: "SOL Whale",
      walletAddress: "3xB9L4o5sVNnqgCLZCzyzPVh9BKcEsKUHsNvCm7Hdb4C",
      roi: 142,
      pnlPercentage: -5.2,
      solanaInvested: 3400
    }
  ];

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const renderContent = () => {
    if (currentPage === 'transfer') return <TransferFunds />;
    if (currentPage === 'dashboard') return <Dashboard />;
    if (currentPage === 'nft') return <NFTAccess />;

    if (activeView === 'tracking') return <TrackWallets />;
    if (activeView === 'mev') return <MEVDashboard />;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {connected ? (
          <>
            <AddWallet />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wallets.map((wallet, index) => (
                <TraderCard 
                  key={index} 
                  {...wallet} 
                  onClick={() => setSelectedTrader(index)}
                  onDeactivate={() => {}}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <button
              onClick={handleConnectWallet}
              disabled={connecting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              {connecting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect Phantom Wallet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Navbar 
        activeView={activeView}
        onViewChange={setActiveView}
        onPageChange={setCurrentPage}
      />
      {renderContent()}
    </main>
  );
}