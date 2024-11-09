use uuid::Uuid;

use crate::db;

pub struct FileRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> FileRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }

    pub async fn create(&self, path: String) -> Result<db::models::file::File, sqlx::Error> {
        let result = sqlx::query_as::<_, db::models::file::File>(
            r#"INSERT INTO file (path) VALUES ($1) RETURNING *"#,
        )
        .bind(path)
        .fetch_one(self.db)
        .await;

        result
    }

    pub async fn fetch_one(&self, id: Uuid) -> Result<db::models::file::File, sqlx::Error> {
        let query =
            sqlx::query_as::<_, db::models::file::File>(r#"SELECT * FROM file WHERE id = $1"#)
                .bind(id)
                .fetch_one(self.db)
                .await;

        query
    }

    pub async fn change_status(
        &self,
        id: Uuid,
        status: db::models::file::FileStatus,
    ) -> Result<db::models::file::File, sqlx::Error> {
        let result = sqlx::query_as::<_, db::models::file::File>(
            r#"UPDATE file SET status = $1 WHERE id = $2 RETURNING *"#,
        )
        .bind(status)
        .bind(id)
        .fetch_one(self.db)
        .await;

        result
    }
}
