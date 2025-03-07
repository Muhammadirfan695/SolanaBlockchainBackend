import { PublicKey } from '@solana/web3.js';
import { connection } from './solana';
import { CONFIG } from '../config';

export class TraderManager {
  private static instance: TraderManager;
  private activeTraders: Map<string, any> = new Map();

  static getInstance(): TraderManager {
    if (!TraderManager.instance) {
      TraderManager.instance = new TraderManager();
    }
    return TraderManager.instance;
  }

  async addTrader(walletAddress: string, config: any): Promise<boolean> {
    try {
      // Vérifier si le wallet existe
      const pubKey = new PublicKey(walletAddress);
      const accountInfo = await connection.getAccountInfo(pubKey);
      
      if (!accountInfo) {
        throw new Error('Wallet invalide');
      }

      // Créer le PDA pour le profil du trader
      const [traderProfilePDA] = await PublicKey.findProgramAddress(
        [Buffer.from('trader'), pubKey.toBuffer()],
        new PublicKey(CONFIG.PROGRAM_ID)
      );

      // Ajouter à la liste des traders actifs
      this.activeTraders.set(walletAddress, {
        address: walletAddress,
        config,
        profilePDA: traderProfilePDA
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du trader:', error);
      return false;
    }
  }

  async getTraderStats(walletAddress: string) {
    try {
      const trader = this.activeTraders.get(walletAddress);
      if (!trader) return null;

      // Récupérer les statistiques depuis le programme
      const accountInfo = await connection.getAccountInfo(trader.profilePDA);
      if (!accountInfo) return null;

      // Décoder les données du compte
      // Implémenter le décodage des données selon la structure du programme
      
      return {
        roi: 0,
        pnlPercentage: 0,
        totalTrades: 0,
        successfulTrades: 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }
  }

  async updateTraderConfig(walletAddress: string, newConfig: any): Promise<boolean> {
    try {
      const trader = this.activeTraders.get(walletAddress);
      if (!trader) return false;

      // Mettre à jour la configuration
      this.activeTraders.set(walletAddress, {
        ...trader,
        config: newConfig
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la config:', error);
      return false;
    }
  }

  getActiveTraders(): any[] {
    return Array.from(this.activeTraders.values());
  }
}