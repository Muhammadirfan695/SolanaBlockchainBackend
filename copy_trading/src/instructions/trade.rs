use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount, Transfer};

pub fn execute_buy(ctx: Context<ExecuteCopyTrade>, amount: u64) -> Result<()> {
    // Transfer tokens from user to pool
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );

    token::transfer(transfer_ctx, amount)?;
    Ok(())
}

pub fn execute_sell(ctx: Context<ExecuteCopyTrade>, amount: u64) -> Result<()> {
    // Transfer tokens from pool to user
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );

    token::transfer(transfer_ctx, amount)?;
    Ok(())
}