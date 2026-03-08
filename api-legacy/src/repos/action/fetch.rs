use uuid::Uuid;

use crate::db::models::action::Action;

impl super::ActionRepo<'_> {
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
