import React from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { Wallet } from 'lucide-react';

export default function ConnectWallet() {
  const { isConnected, publicKey, balance, connect, disconnect } = useWalletContext();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="bg-white/5 px-4 py-2 rounded-lg">
        <p className="text-sm text-gray-400">Balance</p>
        <p className="text-white font-medium">{balance.toFixed(4)} SOL</p>
      </div>
      <div className="bg-white/5 px-4 py-2 rounded-lg">
        <p className="text-sm text-gray-400">Wallet</p>
        <p className="text-white font-medium">
          {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
        </p>
      </div>
      <button
        onClick={handleDisconnect}
        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
}