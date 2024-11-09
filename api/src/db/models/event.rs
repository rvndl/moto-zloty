use chrono::{DateTime, Utc};
use uuid::Uuid;

use super::account::AccountInfo;

#[derive(Debug, Default, serde::Deserialize, serde::Serialize, sqlx::Type)]
#[sqlx(type_name = "event_status", rename_all = "lowercase")]
pub enum EventStatus {
    #[default]
    PENDING,
    APPROVED,
    REJECTED,
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
    pub address: String,

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

    /// Id of the account that created the event
    pub account_id: Uuid,

    /// Account that created the event
    #[sqlx(skip)]
    pub account: Option<AccountInfo>,
}
