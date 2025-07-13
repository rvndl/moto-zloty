use crate::db::models::event::{Event, EventStatus};

use super::helpers::{join_event_properties, JoinEventFlags};
use sqlx::Row;

impl super::EventRepo<'_> {
    pub async fn search(&self, search_string: &str) -> Result<Vec<Event>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT
                e.*,
                ad.id AS address_id,
                ad.name AS address_name,
                ad.house_number AS address_house_number,
                ad.road AS address_road,
                ad.neighbourhood AS address_neighbourhood,
                ad.suburb AS address_suburb,
                ad.city AS address_city,
                ad.state AS address_state,
                ad.created_at AS address_created_at,
                similarity(
                    e.name || ' ' ||
                    COALESCE(e.address, '') || ' ' ||
                    COALESCE(ad.name, '') || ' ' ||
                    COALESCE(ad.house_number, '') || ' ' ||
                    COALESCE(ad.road, '') || ' ' ||
                    COALESCE(ad.neighbourhood, '') || ' ' ||
                    COALESCE(ad.suburb, '') || ' ' ||
                    COALESCE(ad.city, '') || ' ' ||
                    COALESCE(ad.state, '')
                , $1) AS score
            FROM event e
            LEFT JOIN address ad ON e.full_address_id = ad.id
            WHERE similarity(
                    e.name || ' ' ||
                    COALESCE(e.address, '') || ' ' ||
                    COALESCE(ad.name, '') || ' ' ||
                    COALESCE(ad.house_number, '') || ' ' ||
                    COALESCE(ad.road, '') || ' ' ||
                    COALESCE(ad.neighbourhood, '') || ' ' ||
                    COALESCE(ad.suburb, '') || ' ' ||
                    COALESCE(ad.city, '') || ' ' ||
                    COALESCE(ad.state, '')
                , $1) > 0.06
            AND e.status != $2
            ORDER BY score DESC
            LIMIT 10;
            "#,
        )
        .bind(search_string)
        .bind(EventStatus::REJECTED)
        .fetch_all(self.db)
        .await?;

        let events = rows
            .into_iter()
            .map(|row| {
                let joined_event_properties =
                    join_event_properties(&row, JoinEventFlags::Address.into());

                Event {
                    id: row.get("id"),
                    name: row.get("name"),
                    description: row.get("description"),
                    full_address_id: row.get("full_address_id"),
                    status: row.get("status"),
                    longitude: row.get("longitude"),
                    latitude: row.get("latitude"),
                    date_from: row.get("date_from"),
                    date_to: row.get("date_to"),
                    created_at: row.get("created_at"),
                    banner_id: row.get("banner_id"),
                    banner_small_id: row.get("banner_small_id"),
                    account_id: row.get("account_id"),
                    full_address: joined_event_properties.address,
                    account: None,
                }
            })
            .collect();

        Ok(events)
    }
}
