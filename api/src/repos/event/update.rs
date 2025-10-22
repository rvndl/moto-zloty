use uuid::Uuid;

use crate::db::models::event::{Event, EventStatus};

impl super::EventRepo<'_> {
    pub async fn update_status(&self, id: Uuid, status: EventStatus) -> Result<Event, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            UPDATE event
            SET status = $1
            WHERE id = $2
            RETURNING *
            "#,
        )
        .bind(status)
        .bind(id)
        .fetch_one(self.db)
        .await;

        query
    }

    pub async fn update_full_address_id(
        &self,
        id: Uuid,
        full_address_id: Uuid,
    ) -> Result<Event, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            UPDATE event
            SET full_address_id = $1
            WHERE id = $2
            RETURNING *
            "#,
        )
        .bind(full_address_id)
        .bind(id)
        .fetch_one(self.db)
        .await;

        query
    }

    pub async fn update_lat_lang(
        &self,
        id: Uuid,
        lat: f64,
        lon: f64,
    ) -> Result<Event, sqlx::Error> {
        let query = sqlx::query_as::<_, Event>(
            r#"
            UPDATE event
            SET latitude = $1, longitude = $2
            WHERE id = $3
            RETURNING *
            "#,
        )
        .bind(lat)
        .bind(lon)
        .bind(id)
        .fetch_one(self.db)
        .await;

        query
    }
}
