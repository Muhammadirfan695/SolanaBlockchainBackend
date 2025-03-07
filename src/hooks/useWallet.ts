import { useState, useCallback } from 'react';

export const useWallet = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPublicKey("DummyPublicKey123");
      setBalance(1.5); // Simulated balance
      setConnected(true);
    } catch (err) {
      console.error("Wallet connection error:", err);
      throw err;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setConnected(false);
    setPublicKey(null);
    setBalance(0);
  }, []);

  return {
    connected,
    connecting,
    publicKey,
    balance,
    connect,
    disconnect
  };
};