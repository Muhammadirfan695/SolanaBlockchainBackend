import { Keypair, PublicKey } from '@solana/web3.js';
import { encrypt, decrypt } from './crypto';
import { generateDeviceId } from './device';

export class WalletManager {
  private static readonly WALLET_KEY = 'copy_trading_wallet';
  private static readonly EXPIRY_KEY = 'wallet_expiry';
  private static readonly EXPIRY_DURATION = 48 * 60 * 60 * 1000; // 48 hours

  private keypair: Keypair | null = null;
  private deviceId: string = '';

  constructor() {
    this.initializeDeviceId();
  }

  private async initializeDeviceId(): Promise<void> {
    this.deviceId = await generateDeviceId();
  }

  async createWallet(): Promise<{ publicKey: string; privateKey: string }> {
    await this.ensureDeviceId();
    
    const keypair = Keypair.generate();
    const privateKey = Buffer.from(keypair.secretKey).toString('hex');
    const publicKey = keypair.publicKey.toString();

    const encryptedKey = await encrypt(privateKey, this.deviceId);
    
    localStorage.setItem(WalletManager.WALLET_KEY, encryptedKey);
    localStorage.setItem(
      WalletManager.EXPIRY_KEY, 
      (Date.now() + WalletManager.EXPIRY_DURATION).toString()
    );

    this.keypair = keypair;
    
    return {
      publicKey,
      privateKey
    };
  }

  private async ensureDeviceId(): Promise<void> {
    if (!this.deviceId) {
      this.deviceId = await generateDeviceId();
    }
  }

  async loadWallet(): Promise<boolean> {
    await this.ensureDeviceId();
    
    const encryptedKey = localStorage.getItem(WalletManager.WALLET_KEY);
    const expiry = localStorage.getItem(WalletManager.EXPIRY_KEY);

    if (!encryptedKey || !expiry) {
      return false;
    }

    if (Date.now() > parseInt(expiry)) {
      this.clearWallet();
      return false;
    }

    try {
      const privateKey = await decrypt(encryptedKey, this.deviceId);
      const secretKey = Buffer.from(privateKey, 'hex');
      this.keypair = Keypair.fromSecretKey(secretKey);
      return true;
    } catch (error) {
      console.error('Error loading wallet:', error);
      return false;
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this.keypair) {
      throw new Error('No wallet loaded');
    }

    try {
      return await transaction.partialSign(this.keypair);
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  getPublicKey(): PublicKey | null {
    return this.keypair?.publicKey || null;
  }

  clearWallet(): void {
    localStorage.removeItem(WalletManager.WALLET_KEY);
    localStorage.removeItem(WalletManager.EXPIRY_KEY);
    this.keypair = null;
  }

  isWalletExpired(): boolean {
    const expiry = localStorage.getItem(WalletManager.EXPIRY_KEY);
    return !expiry || Date.now() > parseInt(expiry);
  }

  refreshWalletAccess(): void {
    localStorage.setItem(
      WalletManager.EXPIRY_KEY,
      (Date.now() + WalletManager.EXPIRY_DURATION).toString()
    );
  }
}