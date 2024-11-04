import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { BN } from 'bn.js';

export interface EnergyOffer {
  id: string;
  seller: PublicKey;
  kwhAmount: number;
  pricePerKwh: number;
  active: boolean;
}

export class MarketService {
  private connection: Connection;
  private program: Program;

  constructor(connection: Connection, program: Program) {
    this.connection = connection;
    this.program = program;
  }

  async createEnergyOffer(kwhAmount: number, pricePerKwh: number) {
    try {
      const tx = await this.program.methods
        .createOffer(new BN(kwhAmount), new BN(pricePerKwh))
        .rpc();
      
      await this.connection.confirmTransaction(tx);
      return tx;
    } catch (error) {
      console.error('Error creating energy offer:', error);
      throw error;
    }
  }

  async purchaseEnergy(offerId: string, kwhAmount: number) {
    try {
      const tx = await this.program.methods
        .purchaseEnergy(new PublicKey(offerId), new BN(kwhAmount))
        .rpc();
      
      await this.connection.confirmTransaction(tx);
      return tx;
    } catch (error) {
      console.error('Error purchasing energy:', error);
      throw error;
    }
  }

  async getActiveOffers(): Promise<EnergyOffer[]> {
    try {
      const offers = await this.program.account.energyOffers.all();
      return offers
        .filter(offer => offer.account.active)
        .map(offer => ({
          id: offer.publicKey.toBase58(),
          seller: offer.account.seller,
          kwhAmount: offer.account.kwhAmount.toNumber(),
          pricePerKwh: offer.account.pricePerKwh.toNumber(),
          active: offer.account.active
        }));
    } catch (error) {
      console.error('Error fetching active offers:', error);
      throw error;
    }
  }
}