use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct CopyTradingConfig {
    pub strategy: CopyStrategy,
    pub min_order_size: u64,
    pub total_allocation: u64,
    pub stop_loss_percentage: u16,
    pub priority_fee: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum CopyStrategy {
    ExactAmount,
    Percentage(f64),
}

impl Default for CopyStrategy {
    fn default() -> Self {
        Self::ExactAmount
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum TradeSide {
    Buy,
    Sell,
}

#[account]
pub struct CopyTrading {
    pub trader: Pubkey,
    pub config: CopyTradingConfig,
    pub is_active: bool,
    pub bump: u8,
}

impl CopyTrading {
    pub const SPACE: usize = 8 +    // Discriminator
        32 +                        // trader
        1 +                         // is_active
        1 +                         // bump
        64;                         // config (approximate)
}