use uuid::Uuid;

use crate::db::{self, models};

pub struct EventRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> EventRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }

    pub async fn create(
        &self,
        name: String,
        description: String,
        address: String,
        latitude: f64,
        longitude: f64,
        account_id: Uuid,
    ) -> Result<models::event::Event, sqlx::Error> {
        let result = sqlx::query_as::<_, models::event::Event>(
          r#"INSERT INTO event (name, description, address, latitude, longitude, account_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"#,
      )
      .bind(name)
      .bind(description)
      .bind(address)
      .bind(latitude)
      .bind(longitude)
      .bind(account_id)
      .fetch_one(self.db)
      .await;

        result
    }

    pub async fn fetch_all(&self) -> Result<Vec<models::event::Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, models::event::Event>(r#"SELECT * FROM event"#)
            .fetch_all(self.db)
            .await;

        query
    }

    pub async fn fetch_all_with_accounts(&self) -> Result<Vec<models::event::Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, models::event::Event>(
            r#"SELECT e.*, a.username FROM event e LEFT JOIN account a ON e.account_id = a.id"#,
        )
        .fetch_all(self.db)
        .await;

        query
    }

    pub async fn fetch_by_id(&self, id: Uuid) -> Result<models::event::Event, sqlx::Error> {
        let query =
            sqlx::query_as::<_, models::event::Event>(r#"SELECT * FROM event WHERE id = $1"#)
                .bind(id)
                .fetch_one(self.db)
                .await;

        query
    }

    pub async fn fetch_by_account_id(
        &self,
        account_id: Uuid,
    ) -> Result<Vec<models::event::Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, models::event::Event>(
            r#"SELECT * FROM event WHERE account_id = $1"#,
        )
        .bind(account_id)
        .fetch_all(self.db)
        .await;

        query
    }
}
