use uuid::Uuid;

use crate::db::models::file::File;

impl super::FileRepo<'_> {
    pub async fn delete(&self, id: Uuid) -> Result<File, sqlx::Error> {
        let result = sqlx::query_as::<_, File>(r#"DELETE FROM file WHERE id = $1 RETURNING *"#)
            .bind(id)
            .fetch_one(self.db)
            .await;

        result
    }
}
