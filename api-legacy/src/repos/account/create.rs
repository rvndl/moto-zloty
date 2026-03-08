use crate::db::models::account::Account;

impl super::AccountRepo<'_> {
    pub async fn create(
        &self,
        username: &str,
        password: &str,
        email: &str,
    ) -> Result<Account, sqlx::Error> {
        let result = sqlx::query_as::<_, Account>(
            r#"INSERT INTO account (username, password, email) VALUES ($1, $2, $3) RETURNING *"#,
        )
        .bind(username)
        .bind(password)
        .bind(email)
        .fetch_one(self.db)
        .await;

        result
    }
}
