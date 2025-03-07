import React, { useState } from 'react';
import { Lock, MessageSquare, Plus, Trash2, Settings, AlertTriangle, Zap, DollarSign, Check } from 'lucide-react';

export default function TelegramCopy() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [telegramCode, setTelegramCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleTelegramAuth = async () => {
    try {
      if (phoneNumber && telegramCode) {
        setIsAuthenticated(true);
        setShowAuthModal(false);
      }
    } catch (error) {
      console.error('Telegram authentication error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Lock className="h-12 w-12 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">Connect Your Telegram</h2>
          <p className="text-gray-400 text-center mb-6">
            Connect your Telegram account to start copying trades from your favorite channels
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Connect Telegram Account
          </button>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Telegram Authentication</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Authentication Code</label>
                  <input
                    type="text"
                    value={telegramCode}
                    onChange={(e) => setTelegramCode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="Enter code from Telegram"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    You will receive a code in your Telegram app
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTelegramAuth}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-500/10 rounded-lg p-4 max-w-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
            <p className="text-yellow-500 text-sm">
              You need to connect your Telegram account to use the copy trading feature. This allows us to monitor your selected channels and execute trades automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Connected Telegram Channels</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add New Channel
        </button>
      </div>
    </div>
  );
}