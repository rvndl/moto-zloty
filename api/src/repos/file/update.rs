use uuid::Uuid;

use crate::db::models::file::{File, FileStatus};

impl super::FileRepo<'_> {
    pub async fn update_status(&self, id: Uuid, status: FileStatus) -> Result<File, sqlx::Error> {
        let result =
            sqlx::query_as::<_, File>(r#"UPDATE file SET status = $1 WHERE id = $2 RETURNING *"#)
                .bind(status)
                .bind(id)
                .fetch_one(self.db)
                .await;

        result
    }
}
