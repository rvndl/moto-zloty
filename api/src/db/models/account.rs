use core::fmt;

use chrono::NaiveDateTime;

use super::event::Event;

#[derive(Debug, serde::Deserialize, serde::Serialize, sqlx::Type)]
#[sqlx(type_name = "account_rank", rename_all = "lowercase")]
pub enum AccountRank {
    USER,
    ADMIN,
}

impl fmt::Display for AccountRank {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

#[derive(Debug, serde::Deserialize, serde::Serialize, sqlx::FromRow)]
pub struct Account {
    /// Id of the account
    pub id: i32,

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
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ban_reason: Option<String>,

    /// Date and time when the account was banned
    /// Only present if the account is banned
    #[serde(skip_serializing_if = "Option::is_none")]
    pub banned_at: Option<NaiveDateTime>,

    /// Date and time when the account was created
    pub created_at: NaiveDateTime,

    /// Events the account created
    #[sqlx(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub events: Option<Vec<Event>>,
}
