use crate::db::models::{
    account::{Account, AccountInfo, AccountWithoutPassword, PublicAccount},
    address::Address,
};
use enumflags2::{bitflags, BitFlags};
use sqlx::{postgres::PgRow, Row};

#[bitflags]
#[repr(u8)]
#[derive(Copy, Clone, Debug, PartialEq)]
pub enum JoinEventFlags {
    None = 1,
    Account = 1 << 1,
    Address = 1 << 2,
    AccountTypeFull = 1 << 3,
    AccountTypePublic = 1 << 4,
    AccountTypeWithoutPassword = 1 << 5,
}

pub struct EventJoinedProperties {
    pub account: Option<AccountInfo>,
    pub address: Option<Address>,
}

/// Function to join event with account and address
/// - `account` rows have to be prefixed with `account_`
/// - `address` rows have to be prefixed with `address_`
pub fn join_event_properties(
    row: &PgRow,
    flags: BitFlags<JoinEventFlags>,
) -> EventJoinedProperties {
    let mut event = EventJoinedProperties {
        account: None,
        address: None,
    };

    if flags.contains(JoinEventFlags::Account) {
        if let Ok(id) = row.try_get("account_id") {
            let account = Account {
                id,
                username: row.get("account_username"),
                password: row.get("account_password"),
                email: row.get("account_email"),
                rank: row.get("account_rank"),
                banned: row.get("account_banned"),
                ban_reason: row.get("account_ban_reason"),
                banned_at: row.get("account_banned_at"),
                created_at: row.get("account_created_at"),
                events: None,
            };

            let mapped_account = match flags {
                flags if flags.contains(JoinEventFlags::AccountTypeFull) => {
                    Some(AccountInfo::Full(account))
                }
                flags if flags.contains(JoinEventFlags::AccountTypePublic) => {
                    Some(AccountInfo::Public(PublicAccount::from(account)))
                }
                flags if flags.contains(JoinEventFlags::AccountTypeWithoutPassword) => Some(
                    AccountInfo::WithoutPassword(AccountWithoutPassword::from(account)),
                ),
                _ => None,
            };

            event.account = mapped_account;
        }
    }

    if flags.contains(JoinEventFlags::Address) {
        if let Ok(id) = row.try_get("address_id") {
            event.address = Some(Address {
                id,
                name: row.try_get("address_name").unwrap_or(None),
                house_number: row.try_get("address_house_number").unwrap_or(None),
                road: row.try_get("address_road").unwrap_or(None),
                neighbourhood: row.try_get("address_neighbourhood").unwrap_or(None),
                suburb: row.try_get("address_suburb").unwrap_or(None),
                city: row.try_get("address_city").unwrap_or(None),
                state: row.try_get("address_state").unwrap_or(None),
                created_at: row.get("address_created_at"),
            });
        }
    }

    event
}
