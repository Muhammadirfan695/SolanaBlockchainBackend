use anchor_lang::prelude::*;
use crate::state::trader::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct AddTrader<'info> {
    #[account(
        init,
        payer = authority,
        space = TraderProfile::SPACE,
        seeds = [b"trader", trader_wallet.key().as_ref()],
        bump
    )]
    pub trader_profile: Account<'info, TraderProfile>,
    /// The wallet address to track
    pub trader_wallet: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTraderStats<'info> {
    #[account(
        mut,
        seeds = [b"trader", trader_profile.wallet_address.as_ref()],
        bump = trader_profile.bump,
    )]
    pub trader_profile: Account<'info, TraderProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn add_trader(
    ctx: Context<AddTrader>,
    name: String,
) -> Result<()> {
    require!(
        name.len() <= TraderProfile::MAX_NAME_LENGTH,
        CopyTradingError::NameTooLong
    );

    let trader_profile = &mut ctx.accounts.trader_profile;
    let clock = Clock::get()?;

    trader_profile.wallet_address = ctx.accounts.trader_wallet.key();
    trader_profile.name = name;
    trader_profile.roi = 0;
    trader_profile.pnl_percentage = 0;
    trader_profile.solana_invested = 0;
    trader_profile.total_trades = 0;
    trader_profile.successful_trades = 0;
    trader_profile.creation_timestamp = clock.unix_timestamp;
    trader_profile.last_updated = clock.unix_timestamp;
    trader_profile.is_verified = false;
    trader_profile.bump = *ctx.bumps.get("trader_profile").unwrap();

    Ok(())
}

pub fn update_trader_stats(
    ctx: Context<UpdateTraderStats>,
    roi: i64,
    pnl_percentage: i64,
    solana_invested: u64,
    total_trades: u32,
    successful_trades: u32,
) -> Result<()> {
    let trader_profile = &mut ctx.accounts.trader_profile;
    let clock = Clock::get()?;

    trader_profile.roi = roi;
    trader_profile.pnl_percentage = pnl_percentage;
    trader_profile.solana_invested = solana_invested;
    trader_profile.total_trades = total_trades;
    trader_profile.successful_trades = successful_trades;
    trader_profile.last_updated = clock.unix_timestamp;

    Ok(())
}