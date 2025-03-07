import React from 'react';
import { ChevronRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface BreadcrumbsProps {
  items: {
    label: string;
    onClick?: () => void;
    address?: string;
  }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="flex items-center space-x-2 text-sm mb-8 px-4 sm:px-6 lg:px-8">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <span
              className={`${
                item.onClick ? 'cursor-pointer hover:text-purple-400' : ''
              } ${
                index === items.length - 1 ? 'text-white' : 'text-gray-400'
              }`}
              onClick={item.onClick}
            >
              {item.label}
            </span>
            {item.address && (
              <button
                onClick={() => handleCopy(item.address!)}
                className="ml-2 p-1 hover:bg-white/5 rounded-lg transition-colors"
                title="Copy address"
              >
                {copiedAddress === item.address ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
            )}
          </div>
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}