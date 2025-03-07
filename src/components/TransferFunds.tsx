import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, AlertTriangle } from 'lucide-react';

type TransferType = 'deposit' | 'withdraw';

interface Transaction {
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

export default function TransferFunds() {
  const [transferType, setTransferType] = useState<TransferType>('deposit');
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('GmeAY7fZRuNwyq1d8KEjoc1Y4feXbCCCwYnr6Vgxgw6P');
  const [priorityFee, setPriorityFee] = useState('0.00001');

  const transactions: Transaction[] = [
    { amount: 0.1000, date: 'Jul 9, 2024 05:37 PM', status: 'success' },
    { amount: 0.1200, date: 'Jun 10, 2024 09:09 PM', status: 'success' },
    { amount: 0.0500, date: 'Apr 30, 2024 12:54 PM', status: 'success' },
  ];

  const walletAddress = '4KB..w9v';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setTransferType('deposit')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              transferType === 'deposit'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setTransferType('withdraw')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              transferType === 'withdraw'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Withdraw
          </button>
        </div>

        <div className="space-y-6">
          {transferType === 'deposit' ? (
            <>
              <p className="text-gray-400">
                Deposit SOL to your Photon trading wallet.
              </p>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Deposit SOL amount</label>
                <input
                  type="number"
                  placeholder="Input amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Deposit to</label>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                  {walletAddress}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400">
                Withdraw from Photon trading wallet to your selected wallet. Please keep a balance of 0.0025SOL + priority fee for the withdrawal to be successful.
              </p>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Withdraw from</label>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                  {walletAddress}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">SOL amount</label>
                <input
                  type="number"
                  placeholder="Input amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Withdraw to</label>
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">Priority Fee</label>
            <input
              type="number"
              value={priorityFee}
              onChange={(e) => setPriorityFee(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
          </div>

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
            {transferType === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-white font-medium mb-4">History</h3>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    {tx.status === 'success' ? (
                      <ArrowUpRight className="h-5 w-5 text-green-400 mr-3" />
                    ) : tx.status === 'pending' ? (
                      <Clock className="h-5 w-5 text-yellow-400 mr-3" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                    )}
                    <div>
                      <p className="text-white">{tx.amount} SOL</p>
                      <p className="text-sm text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm ${
                    tx.status === 'success' ? 'text-green-400' : 
                    tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">
              There are currently no transactions yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}