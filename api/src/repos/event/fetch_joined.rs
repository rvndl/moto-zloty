use crate::{
    db::models::event::{Event, EventStatus},
    utils::db::SortOrder,
};
use chrono::{DateTime, Utc};
use enumflags2::BitFlags;
use sqlx::Row;
use uuid::Uuid;

use super::helpers::{join_event_properties, EventJoinedProperties, JoinEventFlags};

pub struct FetchAllJoinedParams {
    pub flags: BitFlags<JoinEventFlags>,
    pub status: EventStatus,
    pub date_from: Option<DateTime<Utc>>,
    pub date_to: Option<DateTime<Utc>>,
    pub sort_order: Option<SortOrder>,
    pub state: Option<String>,
    pub show_expired: bool,
}

impl super::EventRepo<'_> {
    pub async fn fetch_all_joined(
        &self,
        params: FetchAllJoinedParams,
    ) -> Result<Vec<Event>, sqlx::Error> {
        let mut query_str = r#"
            SELECT e.id,
                e.name,
                e.description,
                e.address,
                e.full_address_id,
                e.status,
                e.longitude,
                e.latitude,
                e.date_from,
                e.date_to,
                e.created_at,
                e.banner_id,
                e.banner_small_id,
                e.account_id,
                a.id as account_id,
                a.username as account_username,
                a.password as account_password,
                a.email as account_email,
                a.rank as account_rank,
                a.banned as account_banned,
                a.ban_reason as account_ban_reason,
                a.banned_at as account_banned_at,
                a.created_at as account_created_at,
                ad.id as address_id,
                ad.name as address_name,
                ad.house_number as address_house_number,
                ad.road as address_road,
                ad.neighbourhood as address_neighbourhood,
                ad.suburb as address_suburb,
                ad.city as address_city,
                ad.state as address_state,
                ad.created_at as address_created_at
            FROM event e
                LEFT JOIN account a ON e.account_id = a.id
                LEFT JOIN address ad ON e.full_address_id = ad.id
            WHERE
                e.status = $1
            "#
        .to_string();

        if !params.show_expired {
            query_str.push_str(&format!(" AND e.date_to > CURRENT_DATE"));
        }

        let mut bind_index = 2;

        if params.state.is_some() {
            query_str.push_str(&format!(" AND ad.state = ${bind_index}"));
            bind_index += 1;
        }

        if params.date_from.is_some() {
            query_str.push_str(&format!(" AND e.date_from >= ${bind_index}"));
            bind_index += 1;
        }

        if params.date_to.is_some() {
            query_str.push_str(&format!(" AND e.date_from <= ${bind_index}"));
        }

        query_str.push_str(&format!(
            " ORDER BY e.date_from {}",
            params.sort_order.unwrap_or(SortOrder::Asc).to_str()
        ));

        let mut query = sqlx::query(&query_str);
        query = query.bind(params.status);

        if let Some(state) = params.state {
            query = query.bind(state);
        }

        if let Some(date_from) = params.date_from {
            query = query.bind(date_from);
        }

        if let Some(date_to) = params.date_to {
            query = query.bind(date_to);
        }

        let result = query.fetch_all(self.db).await?;

        let events_with_accounts = result
            .into_iter()
            .map(|row| {
                let EventJoinedProperties { account, address } =
                    join_event_properties(&row, params.flags);

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
                    full_address: address,
                    account,
                }
            })
            .collect();

        Ok(events_with_accounts)
    }

    pub async fn fetch_by_id_joined(
        &self,
        id: Uuid,
        join_event_flags: BitFlags<JoinEventFlags>,
    ) -> Result<Event, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT e.id,
                e.name,
                e.description,
                e.status,
                e.longitude,
                e.latitude,
                e.date_from,
                e.date_to,
                e.created_at,
                e.banner_id,
                e.banner_small_id,
                e.account_id,
                e.full_address_id,
                a.id as account_id,
                a.username as account_username,
                a.password as account_password,
                a.email as account_email,
                a.rank as account_rank,
                a.banned as account_banned,
                a.ban_reason as account_ban_reason,
                a.banned_at as account_banned_at,
                a.created_at as account_created_at,
                ad.id as address_id,
                ad.name as address_name,
                ad.house_number as address_house_number,
                ad.road as address_road,
                ad.neighbourhood as address_neighbourhood,
                ad.suburb as address_suburb,
                ad.city as address_city,
                ad.state as address_state,
                ad.created_at as address_created_at
            FROM event e
                LEFT JOIN account a ON e.account_id = a.id
                LEFT JOIN address ad ON e.full_address_id = ad.id
            WHERE e.id = $1
            "#,
        )
        .bind(id)
        .fetch_one(self.db)
        .await?;

        let EventJoinedProperties { account, address } =
            join_event_properties(&row, join_event_flags);

        let event = Event {
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
            account,
            full_address: address,
        };

        Ok(event)
    }

    pub async fn fetch_list_by_state_joined(&self) -> Result<Vec<Event>, sqlx::Error> {
        let query_str = r#"
            SELECT e.id,
                e.name,
                e.full_address_id,
                e.description,
                e.status,
                e.longitude,
                e.latitude,
                e.date_from,
                e.date_to,
                e.created_at,
                e.account_id,
                ad.id as address_id,
                ad.state as address_state,
                ad.created_at as address_created_at
            FROM event e
                LEFT JOIN address ad ON e.full_address_id = ad.id
            WHERE
                e.status NOT IN ($1, $2)
            "#
        .to_string();

        let query = sqlx::query(&query_str)
            .bind(EventStatus::REJECTED)
            .bind(EventStatus::PENDING);

        let result = query.fetch_all(self.db).await?;

        let events_with_address = result
            .into_iter()
            .map(|row| {
                let EventJoinedProperties { account, address } =
                    join_event_properties(&row, JoinEventFlags::None | JoinEventFlags::Address);

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
                    banner_id: None,
                    banner_small_id: None,
                    account_id: row.get("account_id"),
                    full_address: address,
                    account,
                }
            })
            .collect();

        Ok(events_with_address)
    }
}
