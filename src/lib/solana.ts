import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export interface TraderProfile {
  publicKey: PublicKey;
  name: string;
  walletAddress: string;
  roi: number;
  pnlPercentage: number;
  solanaInvested: number;
}

export async function addTrader(
  walletAddress: string,
  name: string,
  config: {
    minOrderSize: number;
    totalAllocation: number;
    stopLossPercentage: number;
  }
): Promise<TraderProfile> {
  // Simulate adding a trader to the network
  return {
    publicKey: new PublicKey(walletAddress),
    name,
    walletAddress,
    roi: 0,
    pnlPercentage: 0,
    solanaInvested: config.totalAllocation
  };
}

export async function getTraderProfile(walletAddress: string): Promise<TraderProfile | null> {
  try {
    const publicKey = new PublicKey(walletAddress);
    // In a real implementation, we would fetch this data from the Solana network
    return {
      publicKey,
      name: "Test Trader",
      walletAddress,
      roi: 0,
      pnlPercentage: 0,
      solanaInvested: 0
    };
  } catch (error) {
    console.error('Error fetching trader profile:', error);
    return null;
  }
}