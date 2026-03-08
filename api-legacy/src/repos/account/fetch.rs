use uuid::Uuid;

use crate::{db::models::account::Account, utils};

impl super::AccountRepo<'_> {
    pub async fn fetch_all(&self) -> Result<Vec<Account>, sqlx::Error> {
        let query = sqlx::query_as::<_, Account>(
            r#"
            SELECT *
            FROM account
            "#,
        )
        .fetch_all(self.db)
        .await;

        query
    }

    pub async fn fetch_one(&self, id: Uuid) -> Result<Account, sqlx::Error> {
        let query = sqlx::query_as::<_, Account>(r#"SELECT * FROM account WHERE id = $1"#)
            .bind(id)
            .fetch_one(self.db)
            .await;

        query
    }

    pub async fn fetch_by_username(&self, username: &str) -> Result<Account, sqlx::Error> {
        let query = sqlx::query_as::<_, Account>(r#"SELECT * FROM account WHERE username = $1"#)
            .bind(username)
            .fetch_one(self.db)
            .await;

        query
    }

    pub async fn fetch_by_email(&self, username: &str) -> Result<Account, sqlx::Error> {
        let query = sqlx::query_as::<_, Account>(r#"SELECT * FROM account WHERE email = $1"#)
            .bind(username)
            .fetch_one(self.db)
            .await;

        query
    }

    pub async fn exists_username(&self, username: &str) -> bool {
        let query = sqlx::query(r#"SELECT * FROM account WHERE username LIKE $1"#)
            .bind(username)
            .fetch_all(self.db)
            .await;

        utils::db::has_any_or_error(query)
    }

    pub async fn exists_email(&self, email: &str) -> bool {
        let query = sqlx::query(r#"SELECT * FROM account WHERE email LIKE $1"#)
            .bind(email)
            .fetch_all(self.db)
            .await;

        utils::db::has_any_or_error(query)
    }
}
