import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntegratedWallet } from '../lib/wallet/IntegratedWallet';
import { useWalletContext } from './WalletContext';
import { ServiceRegistry } from '../lib/services/ServiceRegistry';

interface IntegratedWalletContextType {
  integratedWallet: IntegratedWallet | null;
  isInitialized: boolean;
  publicKey: string | null;
  createNewWallet: () => Promise<void>;
  clearWallet: () => void;
  isLoading: boolean;
  error: string | null;
}

const IntegratedWalletContext = createContext<IntegratedWalletContextType>({
  integratedWallet: null,
  isInitialized: false,
  publicKey: null,
  createNewWallet: async () => {},
  clearWallet: () => {},
  isLoading: false,
  error: null
});

export const useIntegratedWallet = () => useContext(IntegratedWalletContext);

export const IntegratedWalletProvider = ({ children }: { children: ReactNode }) => {
  const [integratedWallet, setIntegratedWallet] = useState<IntegratedWallet | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isConnected: isPhantomConnected } = useWalletContext();
  const services = ServiceRegistry.getInstance();

  useEffect(() => {
    const initializeWallet = async () => {
      if (isPhantomConnected) {
        setIsLoading(true);
        try {
          const wallet = new IntegratedWallet();
          const loaded = await wallet.loadWallet();

          if (loaded) {
            setIntegratedWallet(wallet);
            setPublicKey(wallet.getPublicKey()?.toString() || null);
          }

          setIsInitialized(true);
          setError(null);
        } catch (err) {
          setError('Failed to initialize wallet');
          console.error('Wallet initialization error:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeWallet();
  }, [isPhantomConnected]);

  const createNewWallet = async () => {
    setIsLoading(true);
    try {
      const wallet = new IntegratedWallet();
      const { publicKey } = await wallet.createWallet();
      
      setIntegratedWallet(wallet);
      setPublicKey(publicKey);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError('Failed to create new wallet');
      console.error('Wallet creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearWallet = () => {
    if (integratedWallet) {
      integratedWallet.clearWallet();
      setIntegratedWallet(null);
      setPublicKey(null);
      setError(null);
    }
  };

  return (
    <IntegratedWalletContext.Provider
      value={{
        integratedWallet,
        isInitialized,
        publicKey,
        createNewWallet,
        clearWallet,
        isLoading,
        error
      }}
    >
      {children}
    </IntegratedWalletContext.Provider>
  );
};