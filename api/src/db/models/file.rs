use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Default, serde::Deserialize, serde::Serialize, sqlx::Type)]
#[sqlx(type_name = "file_status", rename_all = "lowercase")]
pub enum FileStatus {
    #[default]
    TEMPORARY,
    PERMANENT,
}

#[derive(Debug, serde::Deserialize, serde::Serialize, sqlx::FromRow)]
pub struct File {
    /// Id of the file
    pub id: Uuid,

    /// Path of the file
    pub path: String,

    /// Status of the file
    /// Can be either `TEMPORARY` or `PERMANENT`
    pub status: FileStatus,

    /// Date and time when the file was created
    pub created_at: DateTime<Utc>,
}
