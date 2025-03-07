use anchor_lang::prelude::*;

#[error_code]
pub enum CopyTradingError {
    #[msg("The provided name is too long")]
    NameTooLong,
    #[msg("Invalid trader account")]
    InvalidTrader,
    #[msg("Copy trading is not active")]
    InactiveCopyTrading,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Invalid statistics update")]
    InvalidStatsUpdate,
}