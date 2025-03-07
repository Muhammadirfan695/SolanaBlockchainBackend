import React, { useState, useEffect } from 'react';
import { Shield, Copy, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useIntegratedWallet } from '../contexts/IntegratedWalletContext';
import { useWalletContext } from '../contexts/WalletContext';

interface WalletSetupProps {
  onComplete: () => void;
}

export default function WalletSetup({ onComplete }: WalletSetupProps) {
  const { createNewWallet, publicKey, isLoading, error } = useIntegratedWallet();
  const { isConnected: isPhantomConnected } = useWalletContext();
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const initializeWallet = async () => {
      if (isPhantomConnected && !publicKey) {
        await createNewWallet();
      }
    };

    initializeWallet();
  }, [isPhantomConnected, publicKey, createNewWallet]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onComplete();
  };

  if (isLoading || !publicKey) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 rounded-lg p-6 text-red-400">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <h3 className="font-bold mb-2">Wallet Setup Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-purple-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">Integrated Wallet Setup</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-yellow-500/10 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
            <p className="text-yellow-500">
              Your integrated wallet has been created and will be used for automated copy trading operations.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Integrated Wallet Address</label>
          <div className="flex items-center bg-white/5 rounded-lg p-4">
            <code className="text-white font-mono text-sm flex-1 break-all">
              {publicKey}
            </code>
            <button
              onClick={() => copyToClipboard(publicKey)}
              className="ml-4 text-gray-400 hover:text-white"
            >
              {copied ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <input
            type="checkbox"
            id="confirm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="confirm" className="text-gray-300">
            I understand that this wallet will be used for copy trading
          </label>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!confirmed}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            confirmed
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Copy Trading
        </button>
      </div>
    </div>
  );
}