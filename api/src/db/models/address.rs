use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, serde::Deserialize, serde::Serialize, sqlx::FromRow)]
pub struct Address {
    /// Id of the address
    pub id: Uuid,

    /// Name of the address
    pub name: Option<String>,

    /// House number of the address
    pub house_number: Option<String>,

    /// Road of the address
    pub road: Option<String>,

    /// Neighbourhood of the address
    pub neighbourhood: Option<String>,

    /// Suburb of the address
    pub suburb: Option<String>,

    /// City of the address
    pub city: Option<String>,

    /// State of the address
    pub state: Option<String>,

    /// Creation date of the address
    pub created_at: DateTime<Utc>,
}
