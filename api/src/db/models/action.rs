use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, serde::Deserialize, serde::Serialize, sqlx::FromRow)]
pub struct Action {
    /// Id of the action
    pub id: Uuid,

    /// Id of the event
    pub event_id: Uuid,

    /// Id of the actor
    pub actor_id: Uuid,

    /// Name of the actor
    pub actor_name: String,

    /// Content of the action
    pub content: String,

    /// Date and time when the file was created
    pub created_at: DateTime<Utc>,
}
