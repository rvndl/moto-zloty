use crate::db::models::account::AccountRank;

pub fn is_permitted(rank: AccountRank) -> bool {
    match rank {
        AccountRank::MOD => true,
        AccountRank::ADMIN => true,
        _ => false,
    }
}
