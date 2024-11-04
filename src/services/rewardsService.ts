import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { BN } from 'bn.js';

export interface UserRewards {
  address: string;
  energyContributed: number;
  voltBalance: number;
  achievements: string[];
}

export class RewardsService {
  private connection: Connection;
  private program: Program;

  constructor(connection: Connection, program: Program) {
    this.connection = connection;
    this.program = program;
  }

  async contributeEnergy(kwhAmount: number) {
    try {
      const tx = await this.program.methods
        .contributeEnergy(new BN(kwhAmount))
        .rpc();
      
      await this.connection.confirmTransaction(tx);
      return tx;
    } catch (error) {
      console.error('Error contributing energy:', error);
      throw error;
    }
  }

  async getUserRewards(userAddress: string): Promise<UserRewards> {
    try {
      const [energyContribution, voltBalance] = await Promise.all([
        this.program.account.energyContributions.fetch(new PublicKey(userAddress)),
        this.program.account.voltBalances.fetch(new PublicKey(userAddress))
      ]);

      return {
        address: userAddress,
        energyContributed: energyContribution.toNumber(),
        voltBalance: voltBalance.toNumber(),
        achievements: await this.getUserAchievements(userAddress)
      };
    } catch (error) {
      console.error('Error fetching user rewards:', error);
      throw error;
    }
  }

  private async getUserAchievements(userAddress: string): Promise<string[]> {
    try {
      const achievements = await this.program.account.userAchievements.fetch(
        new PublicKey(userAddress)
      );
      return achievements.map(achievement => achievement.toString());
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  }
}