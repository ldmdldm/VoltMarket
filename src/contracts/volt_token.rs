use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};

declare_id!("YourProgramIDHere");

#[program]
pub mod volt_token {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, initial_supply: u64) -> Result<()> {
        let mint = &mut ctx.accounts.mint;
        let vault = &mut ctx.accounts.vault;

        // Mint initial supply to the owner (creator of the contract)
        let cpi_accounts = MintTo {
            mint: mint.to_account_info(),
            to: vault.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, initial_supply)?;

        Ok(())
    }

    pub fn contribute_energy(ctx: Context<ContributeEnergy>, kwh_amount: u64) -> Result<()> {
        require!(kwh_amount > 0, VoltTokenError::InvalidAmount);

        let user_data = &mut ctx.accounts.user_data;
        user_data.energy_contributions += kwh_amount;

        // Reward calculation: 1 kWh = 2 VOLT tokens
        let reward_amount = kwh_amount * 2 * 10u64.pow(ctx.accounts.mint.decimals.into());

        // Mint reward tokens to the user
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, reward_amount)?;

        emit!(EnergyContributed {
            user: ctx.accounts.user.key(),
            kwh_amount,
        });

        emit!(RewardsClaimed {
            user: ctx.accounts.user.key(),
            amount: reward_amount,
        });

        Ok(())
    }

    pub fn get_energy_contribution(ctx: Context<GetEnergyContribution>) -> Result<u64> {
        Ok(ctx.accounts.user_data.energy_contributions)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = owner, mint::decimals = 6, mint::authority = owner)]
    pub mint: Account<'info, Mint>,
    #[account(init, payer = owner, space = 8 + Vault::LEN)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ContributeEnergy<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_data: Account<'info, UserData>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct GetEnergyContribution<'info> {
    pub user_data: Account<'info, UserData>,
}

// Account to track user contributions
#[account]
pub struct UserData {
    pub energy_contributions: u64,
}

impl UserData {
    const LEN: usize = 8 + 8;
}

// Error handling for VoltToken
#[error_code]
pub enum VoltTokenError {
    #[msg("Invalid energy amount")]
    InvalidAmount,
}

// Events for contributing energy and claiming rewards
#[event]
pub struct EnergyContributed {
    pub user: Pubkey,
    pub kwh_amount: u64,
}

#[event]
pub struct RewardsClaimed {
    pub user: Pubkey,
    pub amount: u64,
}


    function getEnergyContribution(address user) external view returns (uint256) {
        return energyContributions[user];
    }
}
