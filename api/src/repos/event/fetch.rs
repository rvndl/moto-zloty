use uuid::Uuid;

use crate::db::models::event::{Event, EventStatus};

impl super::EventRepo<'_> {
    pub async fn fetch_all(&self) -> Result<Vec<Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            SELECT *
            FROM event
            "#,
        )
        .fetch_all(self.db)
        .await;

        query
    }

    pub async fn fetch_by_id(&self, id: Uuid) -> Result<Event, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            SELECT *
            FROM event
            WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_one(self.db)
        .await;

        query
    }

    pub async fn fetch_by_account_id(&self, account_id: Uuid) -> Result<Vec<Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            SELECT *
            FROM event
            WHERE account_id = $1
            "#,
        )
        .bind(account_id)
        .fetch_all(self.db)
        .await;

        query
    }

    pub async fn fetch_all_by_status(
        &self,
        status: EventStatus,
    ) -> Result<Vec<Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            SELECT *
            FROM event
            WHERE status = $1
            "#,
        )
        .bind(status)
        .fetch_all(self.db)
        .await;

        query
    }

    pub async fn fetch_six_by_month(
        &self,
        month: i32,
        exclude_event_id: Uuid,
    ) -> Result<Vec<Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            SELECT *
            FROM event
            WHERE EXTRACT(MONTH FROM date_from) = $1
            AND id != $2
            AND status = $3
            ORDER BY date_from ASC
            LIMIT 6
            "#,
        )
        .bind(month)
        .bind(exclude_event_id)
        .bind(EventStatus::APPROVED)
        .fetch_all(self.db)
        .await;

        query
    }

    pub async fn fetch_six_by_state(
        &self,
        state: String,
        exclude_event_id: Uuid,
    ) -> Result<Vec<Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            SELECT e.*, ad.state
            FROM event e
            JOIN address ad ON e.full_address_id = ad.id
            WHERE ad.state = $1
            AND e.id != $2
            AND e.status = $3
            ORDER BY date_from ASC
            LIMIT 6
            "#,
        )
        .bind(state)
        .bind(exclude_event_id)
        .bind(EventStatus::APPROVED)
        .fetch_all(self.db)
        .await;

        query
    }
}
