import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextType {
  isConnected: boolean;
  publicKey: PublicKey | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  publicKey: null,
  balance: 0,
  connect: async () => {},
  disconnect: async () => {},
});

export const useWalletContext = () => useContext(WalletContext);

const network = WalletAdapterNetwork.Devnet;
const endpoint = `https://api.${network}.solana.com`;

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    const updateBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(endpoint);
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    updateBalance();
    const interval = setInterval(updateBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey]);

  const connect = async () => {
    try {
      if (window.solana) {
        const response = await window.solana.connect();
        setPublicKey(new PublicKey(response.publicKey.toString()));
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
        setPublicKey(null);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        publicKey,
        balance,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};