use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use instructions::*;
use state::*;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("your_program_id");

#[program]
pub mod copy_trading {
    use super::*;

    // Trader Management Instructions
    pub fn add_trader(
        ctx: Context<AddTrader>,
        name: String,
    ) -> Result<()> {
        instructions::trader_management::add_trader(ctx, name)
    }

    pub fn update_trader_stats(
        ctx: Context<UpdateTraderStats>,
        roi: i64,
        pnl_percentage: i64,
        solana_invested: u64,
        total_trades: u32,
        successful_trades: u32,
    ) -> Result<()> {
        instructions::trader_management::update_trader_stats(
            ctx,
            roi,
            pnl_percentage,
            solana_invested,
            total_trades,
            successful_trades,
        )
    }

    // Copy Trading Instructions
    pub fn initialize_copy_trading(
        ctx: Context<InitializeCopyTrading>,
        config: CopyTradingConfig,
    ) -> Result<()> {
        let copy_trading = &mut ctx.accounts.copy_trading;
        copy_trading.trader = ctx.accounts.trader.key();
        copy_trading.config = config;
        copy_trading.is_active = true;
        Ok(())
    }

    pub fn execute_copy_trade(
        ctx: Context<ExecuteCopyTrade>,
        amount: u64,
        side: TradeSide,
    ) -> Result<()> {
        // Verify trader being copied
        require!(
            ctx.accounts.copy_trading.trader == ctx.accounts.trader.key(),
            CopyTradingError::InvalidTrader
        );

        // Check if copy trading is active
        require!(
            ctx.accounts.copy_trading.is_active,
            CopyTradingError::InactiveCopyTrading
        );

        // Calculate trade amount based on strategy
        let trade_amount = match ctx.accounts.copy_trading.config.strategy {
            CopyStrategy::ExactAmount => amount,
            CopyStrategy::Percentage(pct) => (amount as f64 * pct / 100.0) as u64,
        };

        // Execute the trade
        match side {
            TradeSide::Buy => execute_buy(ctx, trade_amount)?,
            TradeSide::Sell => execute_sell(ctx, trade_amount)?,
        }

        Ok(())
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_config: CopyTradingConfig,
    ) -> Result<()> {
        let copy_trading = &mut ctx.accounts.copy_trading;
        copy_trading.config = new_config;
        Ok(())
    }
}