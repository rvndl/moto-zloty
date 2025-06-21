use chrono::{DateTime, Utc};
use uuid::Uuid;

use super::{account::AccountInfo, address::Address};

#[derive(Debug, Default, serde::Deserialize, serde::Serialize, sqlx::Type, Clone)]
#[sqlx(type_name = "event_status", rename_all = "lowercase")]
pub enum EventStatus {
    #[default]
    PENDING,
    APPROVED,
    REJECTED,
}

impl EventStatus {
    pub fn get_action_name(&self) -> &'static str {
        match self {
            EventStatus::PENDING => "Stworzenie wydarzenia",
            EventStatus::APPROVED => "Akceptacja wydarzenia",
            EventStatus::REJECTED => "Odrzucenie wydarzenia",
        }
    }
}

#[derive(Debug, serde::Deserialize, serde::Serialize, sqlx::FromRow)]
pub struct Event {
    /// Id of the event
    pub id: Uuid,

    /// Name of the event
    pub name: String,

    /// Description of the event
    pub description: Option<String>,

    /// Full address of the event
    /// Deprecated, use `full_address` instead
    #[deprecated]
    pub address: Option<String>,

    /// Id of the full address
    pub full_address_id: Option<Uuid>,

    /// Status of the event
    /// Can be either `PENDING`, `APPROVED` or `REJECTED`
    pub status: EventStatus,

    /// Longitude of the event
    pub longitude: f64,

    /// Latitude of the event
    pub latitude: f64,

    /// Date and time when the event starts
    pub date_from: DateTime<Utc>,

    /// Date and time when the event ends
    /// Only present if the event has a date to
    pub date_to: DateTime<Utc>,

    /// Date and time when the event was created
    pub created_at: DateTime<Utc>,

    /// Banner of the banner of the event
    /// Only present if the event has a banner
    pub banner_id: Option<Uuid>,

    /// Smaller version of the banner of the event
    /// Only present if the event has a banner
    pub banner_small_id: Option<Uuid>,

    /// Id of the account that created the event
    pub account_id: Uuid,

    /// Account that created the event
    #[sqlx(skip)]
    pub account: Option<AccountInfo>,

    #[sqlx(skip)]
    pub full_address: Option<Address>,
}
