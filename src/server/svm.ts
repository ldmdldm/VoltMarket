import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, Keypair } from '@solana/web3.js';
import { IDL } from '../idl/energy_market';

export function initializeSVM() {
  const connection = new Connection(process.env.SOLANA_RPC_URL || 'http://localhost:8899');
  const wallet = new Keypair(); // In production, use proper key management
  
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  const program = new Program(IDL, process.env.PROGRAM_ID!, provider);

  return {
    connection,
    program,
    provider
  };
}