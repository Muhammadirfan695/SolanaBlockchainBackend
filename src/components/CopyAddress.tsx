import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyAddressProps {
  address: string;
  className?: string;
}

export default function CopyAddress({ address, className = '' }: CopyAddressProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="font-mono">{`${address.slice(0, 4)}...${address.slice(-4)}`}</span>
      <button
        onClick={handleCopy}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}