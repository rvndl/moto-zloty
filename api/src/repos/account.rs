use uuid::Uuid;

use crate::{
    db::{self, models},
    utils,
};

pub struct AccountRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> AccountRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }

    pub async fn create(
        &self,
        username: &str,
        password: &str,
        email: &str,
    ) -> Result<models::account::Account, sqlx::Error> {
        let result = sqlx::query_as::<_, models::account::Account>(
            r#"INSERT INTO account (username, password, email) VALUES ($1, $2, $3) RETURNING *"#,
        )
        .bind(username)
        .bind(password)
        .bind(email)
        .fetch_one(self.db)
        .await;

        result
    }

    pub async fn fetch_one(&self, id: Uuid) -> Result<models::account::Account, sqlx::Error> {
        let query =
            sqlx::query_as::<_, models::account::Account>(r#"SELECT * FROM account WHERE id = $1"#)
                .bind(id)
                .fetch_one(self.db)
                .await;

        query
    }

    pub async fn fetch_by_username(
        &self,
        username: &str,
    ) -> Result<models::account::Account, sqlx::Error> {
        let query = sqlx::query_as::<_, models::account::Account>(
            r#"SELECT * FROM account WHERE username = $1"#,
        )
        .bind(username)
        .fetch_one(self.db)
        .await;

        query
    }

    pub async fn fetch_by_email(
        &self,
        username: &str,
    ) -> Result<models::account::Account, sqlx::Error> {
        let query = sqlx::query_as::<_, models::account::Account>(
            r#"SELECT * FROM account WHERE email = $1"#,
        )
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
