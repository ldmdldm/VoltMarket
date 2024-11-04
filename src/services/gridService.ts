import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';

export class GridService {
  private connection: Connection;
  private program: Program;

  constructor(connection: Connection, program: Program) {
    this.connection = connection;
    this.program = program;
  }

  async updateGridMetrics(
    stability: number,
    networkLoad: number,
    securityStatus: number,
    activeContracts: number
  ) {
    try {
      const tx = await this.program.methods
        .updateGridMetrics(stability, networkLoad, securityStatus, activeContracts)
        .rpc();
      
      await this.connection.confirmTransaction(tx);
      return tx;
    } catch (error) {
      console.error('Error updating grid metrics:', error);
      throw error;
    }
  }

  async getGridMetrics() {
    try {
      const metrics = await this.program.account.gridMetrics.fetch();
      return {
        stability: metrics.stability.toNumber(),
        networkLoad: metrics.networkLoad.toNumber(),
        securityStatus: metrics.securityStatus.toNumber(),
        activeContracts: metrics.activeContracts.toNumber(),
        timestamp: metrics.timestamp.toNumber()
      };
    } catch (error) {
      console.error('Error fetching grid metrics:', error);
      throw error;
    }
  }
}