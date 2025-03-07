import React, { useState } from 'react';
import { Fish, Menu, ChevronDown, Settings, Users, FileText, Globe, Power } from 'lucide-react';
import WalletButton from './WalletButton';

interface NavbarProps {
  activeView: 'copytraders' | 'tracking' | 'mev' | 'sniper' | 'telegram' | 'bundle';
  onViewChange: (view: 'copytraders' | 'tracking' | 'mev' | 'sniper' | 'telegram' | 'bundle') => void;
  onPageChange: (page: 'main' | 'transfer' | 'dashboard' | 'nft') => void;
}

export default function Navbar({ activeView, onViewChange, onPageChange }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="relative group cursor-pointer" onClick={() => onPageChange('main')}>
              <Fish className="h-8 w-8 text-blue-400 transform group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-purple-500 rounded-full" />
            </div>
            <span className="ml-2 text-xl font-bold text-white cursor-pointer" onClick={() => onPageChange('main')}>WhalesX</span>
          </div>

          <div className="flex items-center space-x-4">
            <WalletButton onTransferClick={() => onPageChange('transfer')} />

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-lg shadow-lg">
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        onPageChange('dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 flex items-center"
                    >
                      <Users className="h-4 w-4 mr-3" />
                      <span>Dashboard</span>
                    </button>
                    <button 
                      onClick={() => {
                        onPageChange('nft');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      <span>NFT Access</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 flex items-center">
                      <FileText className="h-4 w-4 mr-3" />
                      <span>Documentation</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 flex items-center">
                      <Globe className="h-4 w-4 mr-3" />
                      <span>Language</span>
                    </button>
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 flex items-center">
                        <Power className="h-4 w-4 mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}