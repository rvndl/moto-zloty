use uuid::Uuid;

use crate::db::models::file::{File, FileStatus};

impl super::FileRepo<'_> {
    pub async fn fetch_one(&self, id: Uuid) -> Result<File, sqlx::Error> {
        let query = sqlx::query_as::<_, File>(r#"SELECT * FROM file WHERE id = $1"#)
            .bind(id)
            .fetch_one(self.db)
            .await;

        query
    }

    pub async fn fetch_all_by_status(&self, status: FileStatus) -> Result<Vec<File>, sqlx::Error> {
        let query = sqlx::query_as::<_, File>(
            r#"
            SELECT *
            FROM file
            WHERE status = $1
            "#,
        )
        .bind(status)
        .fetch_all(self.db)
        .await;

        query
    }
}
