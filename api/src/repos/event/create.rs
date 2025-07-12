use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::db::models::event::Event;

impl super::EventRepo<'_> {
    pub async fn create(
        &self,
        name: &str,
        description: Option<String>,
        address: Option<&str>,
        full_address_id: Uuid,
        lat: f64,
        lon: f64,
        date_from: DateTime<Utc>,
        date_to: DateTime<Utc>,
        banner_id: Option<Uuid>,
        banner_small_id: Option<Uuid>,
        account_id: Uuid,
    ) -> Result<Event, sqlx::Error> {
        let result = sqlx::query_as::<_, Event>(
            r#"
            INSERT INTO event (
                name,
                description,
                address,
                full_address_id,
                latitude,
                longitude,
                date_from,
                date_to,
                banner_id,
                banner_small_id,
                account_id
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11
            )
            RETURNING *;
            "#,
        )
        .bind(name)
        .bind(description)
        .bind(address)
        .bind(full_address_id)
        .bind(lat)
        .bind(lon)
        .bind(date_from)
        .bind(date_to)
        .bind(banner_id)
        .bind(banner_small_id)
        .bind(account_id)
        .fetch_one(self.db)
        .await;

        result
    }
}
