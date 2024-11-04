use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("YourProgramIDHere");

#[program]
pub mod energy_market {
    use super::*;

    // Creates an offer to sell energy
    pub fn create_offer(
        ctx: Context<CreateOffer>,
        kwh_amount: u64,
        price_per_kwh: u64,
    ) -> Result<()> {
        require!(kwh_amount > 0, EnergyMarketError::InvalidAmount);
        require!(price_per_kwh > 0, EnergyMarketError::InvalidPrice);

        let offer = &mut ctx.accounts.offer;
        offer.seller = ctx.accounts.seller.key();
        offer.kwh_amount = kwh_amount;
        offer.price_per_kwh = price_per_kwh;
        offer.active = true;

        emit!(OfferCreated {
            offer_id: offer.id,
            seller: offer.seller,
            kwh_amount,
            price_per_kwh,
        });

        Ok(())
    }

    // Purchases energy from an existing offer
    pub fn purchase_energy(
        ctx: Context<PurchaseEnergy>,
        kwh_amount: u64,
    ) -> Result<()> {
        let offer = &mut ctx.accounts.offer;
        require!(offer.active, EnergyMarketError::InactiveOffer);
        require!(kwh_amount <= offer.kwh_amount, EnergyMarketError::InsufficientEnergy);

        let total_price = kwh_amount * offer.price_per_kwh;

        // Transfer funds from buyer to seller
        let cpi_accounts = Transfer {
            from: ctx.accounts.buyer_token_account.to_account_info(),
            to: ctx.accounts.seller_token_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, total_price)?;

        // Update offer energy amount and status
        offer.kwh_amount -= kwh_amount;
        if offer.kwh_amount == 0 {
            offer.active = false;
        }

        emit!(OfferPurchased {
            offer_id: offer.id,
            buyer: ctx.accounts.buyer.key(),
            kwh_amount,
            total_price,
        });

        Ok(())
    }
}

// Define structures for context accounts
#[derive(Accounts)]
pub struct CreateOffer<'info> {
    #[account(init, payer = seller, space = 8 + Offer::LEN)]
    pub offer: Account<'info, Offer>,
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseEnergy<'info> {
    #[account(mut)]
    pub offer: Account<'info, Offer>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut, constraint = buyer_token_account.owner == buyer.key())]
    pub buyer_token_account: Account<'info, TokenAccount>,
    #[account(mut, constraint = seller_token_account.owner == offer.seller)]
    pub seller_token_account: Account<'info, TokenAccount>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

// Offer structure to store energy sale details
#[account]
pub struct Offer {
    pub id: u64,
    pub seller: Pubkey,
    pub kwh_amount: u64,
    pub price_per_kwh: u64,
    pub active: bool,
}

impl Offer {
    const LEN: usize = 8 + 32 + 8 + 8 + 1;
}

// Custom error codes for the EnergyMarket
#[error_code]
pub enum EnergyMarketError {
    #[msg("Invalid energy amount")]
    InvalidAmount,
    #[msg("Invalid price")]
    InvalidPrice,
    #[msg("Offer is inactive")]
    InactiveOffer,
    #[msg("Insufficient energy in offer")]
    InsufficientEnergy,
}

// Events emitted during interactions with the contract
#[event]
pub struct OfferCreated {
    pub offer_id: u64,
    pub seller: Pubkey,
    pub kwh_amount: u64,
    pub price_per_kwh: u64,
}

#[event]
pub struct OfferPurchased {
    pub offer_id: u64,
    pub buyer: Pubkey,
    pub kwh_amount: u64,
    pub total_price: u64,
}
