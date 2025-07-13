use crate::db::models::file::File;

impl super::FileRepo<'_> {
    pub async fn create(&self, path: &str) -> Result<File, sqlx::Error> {
        let result =
            sqlx::query_as::<_, File>(r#"INSERT INTO file (path) VALUES ($1) RETURNING *"#)
                .bind(path)
                .fetch_one(self.db)
                .await;

        result
    }
}
