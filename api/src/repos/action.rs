use uuid::Uuid;

use crate::db::{self, models::action::Action};

pub struct ActionRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> ActionRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }

    pub async fn create(
        &self,
        event_id: Uuid,
        actor_id: Uuid,
        actor_name: &str,
        content: &str,
    ) -> Result<Action, sqlx::Error> {
        let result = sqlx::query_as::<_, Action>(
            r#"INSERT INTO action (event_id, actor_id, actor_name, content) VALUES ($1, $2, $3, $4) RETURNING *"#,
        )
        .bind(event_id)
        .bind(actor_id)
        .bind(actor_name)
        .bind(content)
        .fetch_one(self.db)
        .await;

        result
    }

    pub async fn fetch_all_by_event_id(&self, event_id: Uuid) -> Result<Vec<Action>, sqlx::Error> {
        let query = sqlx::query_as::<_, Action>(
            r#"SELECT * FROM action WHERE event_id = $1 ORDER BY created_at DESC"#,
        )
        .bind(event_id)
        .fetch_all(self.db)
        .await;

        query
    }
}
