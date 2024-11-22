use uuid::Uuid;

use crate::db::{
    self,
    models::file::{File, FileStatus},
};

pub struct FileRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> FileRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }

    pub async fn create(&self, path: &str) -> Result<File, sqlx::Error> {
        let result =
            sqlx::query_as::<_, File>(r#"INSERT INTO file (path) VALUES ($1) RETURNING *"#)
                .bind(path)
                .fetch_one(self.db)
                .await;

        result
    }

    pub async fn delete(&self, id: Uuid) -> Result<File, sqlx::Error> {
        let result = sqlx::query_as::<_, File>(r#"DELETE FROM file WHERE id = $1 RETURNING *"#)
            .bind(id)
            .fetch_one(self.db)
            .await;

        result
    }

    pub async fn fetch_one(&self, id: Uuid) -> Result<File, sqlx::Error> {
        let query = sqlx::query_as::<_, File>(r#"SELECT * FROM file WHERE id = $1"#)
            .bind(id)
            .fetch_one(self.db)
            .await;

        query
    }

    pub async fn change_status(&self, id: Uuid, status: FileStatus) -> Result<File, sqlx::Error> {
        let result =
            sqlx::query_as::<_, File>(r#"UPDATE file SET status = $1 WHERE id = $2 RETURNING *"#)
                .bind(status)
                .bind(id)
                .fetch_one(self.db)
                .await;

        result
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
