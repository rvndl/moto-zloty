use crate::db::models::account::AccountRank;

/// Checks if given rank is permitted to perform elevated actions.
///
/// Currently, only `MOD` and `ADMIN` ranks are permitted.
pub fn is_permitted(rank: AccountRank) -> bool {
    match rank {
        AccountRank::MOD => true,
        AccountRank::ADMIN => true,
        _ => false,
    }
}
