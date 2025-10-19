use uuid::Uuid;

use crate::db::models::action::Action;

impl super::ActionRepo<'_> {
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
}
