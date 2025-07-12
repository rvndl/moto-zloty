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

    pub async fn fetch_all_carousel(&self) -> Result<Vec<Event>, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            SELECT id,
                name,
                date_from,
                date_to,
                created_at,
                banner_id,
                banner_small_id,
                description,
                address,
                status,
                longitude,
                latitude,
                account_id,
                full_address_id
            FROM event
            WHERE
                date_to + '3 day'::INTERVAL > CURRENT_DATE
            AND status != $1
            AND status != $2
            "#,
        )
        .bind(EventStatus::REJECTED)
        .bind(EventStatus::PENDING)
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
}
