use uuid::Uuid;

use crate::db::models::account::Account;

impl super::AccountRepo<'_> {
    pub async fn update_password(&self, id: Uuid, password: &str) -> Result<Account, sqlx::Error> {
        let result = sqlx::query_as::<_, Account>(
            r#"UPDATE account SET password = $1 WHERE id = $2 RETURNING *"#,
        )
        .bind(password)
        .bind(id)
        .fetch_one(self.db)
        .await;

        result
    }
}
