use crate::{
    db::{
        self,
        models::{
            account::{Account, AccountInfo, AccountWithoutPassword, PublicAccount},
            address::Address,
            event::{Event, EventStatus},
        },
    },
    utils::db::SortOrder,
};
use chrono::{DateTime, Utc};
use enumflags2::{bitflags, BitFlags};
use sqlx::{postgres::PgRow, Row};
use uuid::Uuid;

pub struct FetchAllJoinedParams {
    pub flags: BitFlags<JoinEventFlags>,
    pub status: EventStatus,
    pub date_from: Option<DateTime<Utc>>,
    pub date_to: Option<DateTime<Utc>>,
    pub sort_order: Option<SortOrder>,
    pub state: Option<String>,
}

pub struct EventRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> EventRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }

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

    pub async fn fetch_list_by_state(&self) -> Result<Vec<Event>, sqlx::Error> {
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
            AND
                e.date_to > CURRENT_DATE
            "#
        .to_string();

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

    pub async fn change_status(&self, id: Uuid, status: EventStatus) -> Result<Event, sqlx::Error> {
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

#[bitflags]
#[repr(u8)]
#[derive(Copy, Clone, Debug, PartialEq)]
pub enum JoinEventFlags {
    None = 1,
    Account = 1 << 1,
    Address = 1 << 2,
    AccountTypeFull = 1 << 3,
    AccountTypePublic = 1 << 4,
    AccountTypeWithoutPassword = 1 << 5,
}

struct EventJoinedProperties {
    account: Option<AccountInfo>,
    address: Option<Address>,
}

/// Function to join event with account and address
/// - `account` rows have to be prefixed with `account_`
/// - `address` rows have to be prefixed with `address_`
fn join_event_properties(row: &PgRow, flags: BitFlags<JoinEventFlags>) -> EventJoinedProperties {
    let mut event = EventJoinedProperties {
        account: None,
        address: None,
    };

    if flags.contains(JoinEventFlags::Account) {
        if let Ok(id) = row.try_get("account_id") {
            let account = Account {
                id,
                username: row.get("account_username"),
                password: row.get("account_password"),
                email: row.get("account_email"),
                rank: row.get("account_rank"),
                banned: row.get("account_banned"),
                ban_reason: row.get("account_ban_reason"),
                banned_at: row.get("account_banned_at"),
                created_at: row.get("account_created_at"),
                events: None,
            };

            let mapped_account = match flags {
                flags if flags.contains(JoinEventFlags::AccountTypeFull) => {
                    Some(AccountInfo::Full(account))
                }
                flags if flags.contains(JoinEventFlags::AccountTypePublic) => {
                    Some(AccountInfo::Public(PublicAccount::from(account)))
                }
                flags if flags.contains(JoinEventFlags::AccountTypeWithoutPassword) => Some(
                    AccountInfo::WithoutPassword(AccountWithoutPassword::from(account)),
                ),
                _ => None,
            };

            event.account = mapped_account;
        }
    }

    if flags.contains(JoinEventFlags::Address) {
        if let Ok(id) = row.try_get("address_id") {
            event.address = Some(Address {
                id,
                name: row.try_get("address_name").unwrap_or(None),
                house_number: row.try_get("address_house_number").unwrap_or(None),
                road: row.try_get("address_road").unwrap_or(None),
                neighbourhood: row.try_get("address_neighbourhood").unwrap_or(None),
                suburb: row.try_get("address_suburb").unwrap_or(None),
                city: row.try_get("address_city").unwrap_or(None),
                state: row.try_get("address_state").unwrap_or(None),
                created_at: row.get("address_created_at"),
            });
        }
    }

    event
}
