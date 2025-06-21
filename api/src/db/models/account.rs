use core::fmt;
use std::borrow::Cow;

use chrono::{DateTime, Utc};
use sqlx::types::Uuid;

use super::event::Event;

#[derive(Debug, Clone)]
pub enum AccountMappingType {
    Full,
    Public,
    WithoutPassword,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum AccountInfo {
    Full(Account),
    Public(PublicAccount),
    WithoutPassword(AccountWithoutPassword),
}

#[derive(Default, Debug, Clone, Copy, serde::Deserialize, serde::Serialize, sqlx::Type)]
#[sqlx(type_name = "account_rank", rename_all = "lowercase")]
pub enum AccountRank {
    #[default]
    USER,
    MOD,
    ADMIN,
}

impl fmt::Display for AccountRank {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl<'a> From<AccountRank> for Cow<'a, AccountRank> {
    fn from(rank: AccountRank) -> Self {
        Cow::Owned(rank)
    }
}

impl<'a> From<&'a AccountRank> for Cow<'a, AccountRank> {
    fn from(rank: &'a AccountRank) -> Self {
        Cow::Borrowed(rank)
    }
}

#[derive(Debug, serde::Deserialize, serde::Serialize, sqlx::FromRow)]
pub struct Account {
    /// Id of the account
    pub id: Uuid,

    /// Username of the account
    pub username: String,

    /// Password of the account
    pub password: String,

    /// Email of the account
    pub email: String,

    /// Rank of the account
    /// Can be either `USER` or `ADMIN`
    pub rank: AccountRank,

    /// Whether the account is banned
    pub banned: bool,

    /// Reason for the ban
    /// Only present if the account is banned
    pub ban_reason: Option<String>,

    /// Date and time when the account was banned
    /// Only present if the account is banned
    pub banned_at: Option<DateTime<Utc>>,

    /// Date and time when the account was created
    pub created_at: DateTime<Utc>,

    /// Events the account created
    #[sqlx(skip)]
    pub events: Option<Vec<Event>>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct PublicAccount {
    id: Uuid,
    username: String,
    created_at: DateTime<Utc>,
    rank: AccountRank,
    events: Vec<Event>,
}

impl From<Account> for PublicAccount {
    fn from(account: Account) -> Self {
        PublicAccount {
            id: account.id,
            username: account.username,
            created_at: account.created_at,
            rank: account.rank,
            events: account.events.unwrap_or_default(),
        }
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct AccountWithoutPassword {
    id: Uuid,
    username: String,
    email: String,
    rank: AccountRank,
    banned: bool,
    ban_reason: Option<String>,
    banned_at: Option<DateTime<Utc>>,
    created_at: DateTime<Utc>,
    events: Vec<Event>,
}

impl From<Account> for AccountWithoutPassword {
    fn from(account: Account) -> Self {
        AccountWithoutPassword {
            id: account.id,
            username: account.username,
            email: account.email,
            rank: account.rank,
            banned: account.banned,
            ban_reason: account.ban_reason,
            banned_at: account.banned_at,
            created_at: account.created_at,
            events: account.events.unwrap_or_default(),
        }
    }
}
