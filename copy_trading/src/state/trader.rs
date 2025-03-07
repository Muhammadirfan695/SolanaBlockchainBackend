use anchor_lang::prelude::*;

#[account]
pub struct TraderProfile {
    pub wallet_address: Pubkey,
    pub name: String,              // 32 bytes max
    pub roi: i64,                  // Stored as basis points (1% = 100)
    pub pnl_percentage: i64,       // Stored as basis points
    pub solana_invested: u64,      // In lamports
    pub total_trades: u32,
    pub successful_trades: u32,
    pub creation_timestamp: i64,
    pub last_updated: i64,
    pub is_verified: bool,
    pub bump: u8,
}

impl TraderProfile {
    pub const MAX_NAME_LENGTH: usize = 32;
    pub const SPACE: usize = 8 +    // Discriminator
        32 +                        // wallet_address
        4 + Self::MAX_NAME_LENGTH + // name (string)
        8 +                         // roi
        8 +                         // pnl_percentage
        8 +                         // solana_invested
        4 +                         // total_trades
        4 +                         // successful_trades
        8 +                         // creation_timestamp
        8 +                         // last_updated
        1 +                         // is_verified
        1;                         // bump
}