'use client';

import { ReactNode } from 'react';
import { WalletProvider } from '../contexts/WalletContext';
import { IntegratedWalletProvider } from '../contexts/IntegratedWalletContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <IntegratedWalletProvider>
        {children}
      </IntegratedWalletProvider>
    </WalletProvider>
  );
}