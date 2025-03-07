import { useState, useEffect } from 'react';
import { WalletManager } from '../lib/wallet-manager';

export const useCopyTrading = () => {
  const [activeTraders, setActiveTraders] = useState([
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
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [walletManager] = useState(() => new WalletManager());

  useEffect(() => {
    const initializeWallet = async () => {
      await walletManager.loadWallet();
    };

    initializeWallet();
  }, [walletManager]);

  return {
    activeTraders,
    isLoading
  };
};