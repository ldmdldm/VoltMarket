use anchor_lang::prelude::*;

declare_id!("YourProgramIDHere");

#[program]
pub mod grid_management {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let grid_management_data = &mut ctx.accounts.grid_management_data;
        grid_management_data.admin = ctx.accounts.admin.key();
        Ok(())
    }

    pub fn update_grid_metrics(
        ctx: Context<UpdateGridMetrics>,
        stability: u8,
        network_load: u8,
        security_status: u8,
        active_contracts: u64,
    ) -> Result<()> {
        require!(stability <= 100, GridManagementError::InvalidMetricValue);
        require!(network_load <= 100, GridManagementError::InvalidMetricValue);
        require!(security_status <= 100, GridManagementError::InvalidMetricValue);

        let grid_data = &mut ctx.accounts.grid_management_data;
        grid_data.current_metrics = GridMetrics {
            stability,
            network_load,
            security_status,
            active_contracts,
            timestamp: Clock::get()?.unix_timestamp,
        };

        emit!(MetricsUpdated {
            stability,
            network_load,
            security_status,
            active_contracts,
        });

        Ok(())
    }

    pub fn verify_producer(ctx: Context<VerifyProducer>, producer: Pubkey) -> Result<()> {
        let grid_data = &mut ctx.accounts.grid_management_data;
        grid_data.verified_producers.insert(producer, true);

        emit!(ProducerVerified { producer });
        Ok(())
    }

    pub fn get_grid_metrics(ctx: Context<GetGridMetrics>) -> Result<GridMetrics> {
        Ok(ctx.accounts.grid_management_data.current_metrics.clone())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + GridManagementData::LEN)]
    pub grid_management_data: Account<'info, GridManagementData>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateGridMetrics<'info> {
    #[account(mut, has_one = admin)]
    pub grid_management_data: Account<'info, GridManagementData>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyProducer<'info> {
    #[account(mut, has_one = admin)]
    pub grid_management_data: Account<'info, GridManagementData>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetGridMetrics<'info> {
    pub grid_management_data: Account<'info, GridManagementData>,
}

#[account]
pub struct GridManagementData {
    pub admin: Pubkey,
    pub current_metrics: GridMetrics,
    pub verified_producers: BTreeMap<Pubkey, bool>,
}

impl GridManagementData {
    const LEN: usize = 32 + GridMetrics::LEN + (8 + 32 * 100); // Approximate space for 100 producers
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct GridMetrics {
    pub stability: u8,
    pub network_load: u8,
    pub security_status: u8,
    pub active_contracts: u64,
    pub timestamp: i64,
}

impl GridMetrics {
    const LEN: usize = 1 + 1 + 1 + 8 + 8;
}

#[error_code]
pub enum GridManagementError {
    #[msg("Metric values must be between 0 and 100")]
    InvalidMetricValue,
}

#[event]
pub struct MetricsUpdated {
    pub stability: u8,
    pub network_load: u8,
    pub security_status: u8,
    pub active_contracts: u64,
}

#[event]
pub struct ProducerVerified {
    pub producer: Pubkey,
}
