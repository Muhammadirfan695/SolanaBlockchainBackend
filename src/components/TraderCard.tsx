import React from 'react';
import { TrendingUp, Wallet as WalletIcon, Coins, ExternalLink } from 'lucide-react';
import CopyAddress from './CopyAddress';

interface CopyStatus {
  isActive: boolean;
  tradeName: string;
}

interface TraderCardProps {
  name: string;
  walletAddress: string;
  roi: number;
  pnlPercentage: number;
  solanaInvested: number;
  onClick: () => void;
  onDeactivate: () => void;
  copyStatus?: CopyStatus;
}

export default function TraderCard({ 
  name, 
  walletAddress, 
  roi, 
  pnlPercentage, 
  solanaInvested, 
  onClick,
  onDeactivate,
  copyStatus
}: TraderCardProps) {
  const cieloUrl = `https://app.cielo.finance/profile/${walletAddress}`;

  const handleConfigClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const handleDeactivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeactivate();
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{name || 'Wallet'}</h3>
          <CopyAddress address={walletAddress} className="text-gray-400" />
        </div>
        {copyStatus && (
          <div className={`px-3 py-1 rounded-full text-sm ${
            copyStatus.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {copyStatus.isActive ? 'Active' : 'Inactive'}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg">
          <TrendingUp className="h-5 w-5 text-purple-400 mb-2" />
          <span className="text-sm text-gray-400">ROI</span>
          <span className="text-lg font-bold text-white">{roi}%</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg">
          <Coins className="h-5 w-5 text-yellow-400 mb-2" />
          <span className="text-sm text-gray-400">Invested</span>
          <span className="text-lg font-bold text-white">{solanaInvested} SOL</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg">
          <WalletIcon className="h-5 w-5 text-blue-400 mb-2" />
          <span className="text-sm text-gray-400">PNL</span>
          <span className={`text-lg font-bold ${pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {pnlPercentage}%
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <a 
          href={cieloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View on Cielo
          <ExternalLink className="h-4 w-4 ml-2" />
        </a>
        
        <button 
          onClick={copyStatus?.isActive ? handleDeactivate : handleConfigClick}
          className={`${
            copyStatus?.isActive
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
              : 'bg-white/5 hover:bg-white/10 text-white'
          } py-3 rounded-lg font-medium transition-colors`}
        >
          {copyStatus?.isActive ? 'Deactivate' : 'Configure'}
        </button>
      </div>

      {copyStatus?.isActive && (
        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
          <button
            onClick={handleConfigClick}
            className="text-purple-400 text-sm hover:text-purple-300 transition-colors w-full text-left"
          >
            Modify Configuration →
          </button>
        </div>
      )}
    </div>
  );
}