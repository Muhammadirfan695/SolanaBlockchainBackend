import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { ArrowRight, Loader2, Wallet, ChevronDown } from 'lucide-react';

interface WalletButtonProps {
  onTransferClick: () => void;
}

export default function WalletButton({ onTransferClick }: WalletButtonProps) {
  const { connect, disconnect, connected, connecting, publicKey, balance } = useWallet();
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = async () => {
    if (connected) {
      setShowMenu(!showMenu);
    } else {
      try {
        await connect();
      } catch (err) {
        console.error("Connection error:", err);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={connecting}
        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
          connecting
            ? 'bg-purple-600/50 cursor-not-allowed'
            : connected
            ? 'bg-white/5 hover:bg-white/10'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white`}
      >
        {connecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : connected ? (
          <>
            <Wallet className="h-4 w-4 text-purple-400 mr-2" />
            <span>{balance.toFixed(4)} SOL</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </>
        ) : (
          <>
            Connect Wallet
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </button>

      {connected && showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-lg">
          <div className="py-2">
            <button
              onClick={() => {
                onTransferClick();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5"
            >
              Transfer Funds
            </button>
            <button
              onClick={() => {
                disconnect();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}