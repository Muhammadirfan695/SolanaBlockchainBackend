import { Connection, PublicKey } from '@solana/web3.js';
import { CONFIG } from '../config';

export class TransactionMonitor {
  private connection: Connection;
  private subscribers: Map<string, Function>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.subscribers = new Map();
  }

  async watchTransaction(signature: string): Promise<boolean> {
    try {
      const result = await this.connection.confirmTransaction(signature);
      return result.value.err === null;
    } catch (error) {
      console.error('Transaction monitoring error:', error);
      return false;
    }
  }

  subscribeToTrader(traderAddress: PublicKey, callback: Function) {
    const subscriptionId = this.connection.onAccountChange(
      traderAddress,
      (accountInfo) => {
        callback(accountInfo);
      }
    );
    this.subscribers.set(traderAddress.toString(), callback);
    return subscriptionId;
  }

  unsubscribeFromTrader(traderAddress: string) {
    if (this.subscribers.has(traderAddress)) {
      this.subscribers.delete(traderAddress);
    }
  }

  async getTransactionHistory(address: PublicKey): Promise<any[]> {
    try {
      const signatures = await this.connection.getSignaturesForAddress(address);
      const transactions = await Promise.all(
        signatures.map(sig => this.connection.getTransaction(sig.signature))
      );
      return transactions.filter(tx => tx !== null);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }
}