use crate::{
    db::{
        self,
        models::{
            account::{
                Account, AccountInfo, AccountMappingType, AccountWithoutPassword, PublicAccount,
            },
            event::{Event, EventStatus},
        },
    },
    utils::db::SortOrder,
};
use chrono::{DateTime, Utc};
use sqlx::{postgres::PgRow, Row};
use uuid::Uuid;

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
        address: &str,
        latitude: f64,
        longitude: f64,
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
                $10
            )
            RETURNING *;
            "#,
        )
        .bind(name)
        .bind(description)
        .bind(address)
        .bind(latitude)
        .bind(longitude)
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
                account_id
            FROM event
            WHERE
                date_to + '3 day'::INTERVAL > CURRENT_DATE;
            "#,
        )
        .fetch_all(self.db)
        .await;

        query
    }

    pub async fn fetch_all_with_accounts(
        &self,
        account_mapping_type: AccountMappingType,
        status: EventStatus,
        date_from: Option<DateTime<Utc>>,
        date_to: Option<DateTime<Utc>>,
        sort_order: SortOrder,
    ) -> Result<Vec<Event>, sqlx::Error> {
        let mut query_str = format!(
            r#"
            SELECT e.id,
                e.name,
                e.description,
                e.address,
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
                a.username,
                a.password,
                a.email,
                a.rank,
                a.banned,
                a.ban_reason,
                a.banned_at,
                a.created_at as account_created_at
            FROM event e
                LEFT JOIN account a ON e.account_id = a.id
            WHERE
                e.status = $1
            AND
                e.date_to > CURRENT_DATE 
            "#
        );

        let mut bind_index = 2;

        if date_from.is_some() {
            query_str.push_str(&format!(" AND e.date_from >= ${}", bind_index));
            bind_index += 1;
        }

        if date_to.is_some() {
            query_str.push_str(&format!(" AND e.date_from <= ${}", bind_index));
        }

        query_str.push_str(&format!(" ORDER BY e.date_from {}", sort_order.to_str()));

        let mut query = sqlx::query(&query_str);
        query = query.bind(status);

        if let Some(date_from) = date_from {
            query = query.bind(date_from);
        }

        if let Some(date_to) = date_to {
            query = query.bind(date_to);
        }

        let result = query.fetch_all(self.db).await?;

        let events_with_accounts = result
            .into_iter()
            .map(|row| join_with_account(row, account_mapping_type.clone()))
            .collect();

        Ok(events_with_accounts)
    }

    pub async fn fetch_by_id_with_account(
        &self,
        id: Uuid,
        account_mapping_type: AccountMappingType,
    ) -> Result<Event, sqlx::Error> {
        let query = sqlx::query(
            r#"
            SELECT e.id,
                e.name,
                e.description,
                e.address,
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
                a.username,
                a.password,
                a.email,
                a.rank,
                a.banned,
                a.ban_reason,
                a.banned_at,
                a.created_at as account_created_at
            FROM event e
                LEFT JOIN account a ON e.account_id = a.id
            WHERE e.id = $1
            "#,
        )
        .bind(id)
        .fetch_one(self.db)
        .await?;

        let event_with_account = join_with_account(query, account_mapping_type);

        Ok(event_with_account)
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
}

fn join_with_account(row: PgRow, account_mapping_type: AccountMappingType) -> Event {
    let event_with_account = Event {
        id: row.get("id"),
        name: row.get("name"),
        description: row.get("description"),
        address: row.get("address"),
        status: row.get("status"),
        longitude: row.get("longitude"),
        latitude: row.get("latitude"),
        date_from: row.get("date_from"),
        date_to: row.get("date_to"),
        created_at: row.get("created_at"),
        banner_id: row.get("banner_id"),
        banner_small_id: row.get("banner_small_id"),
        account_id: row.get("account_id"),
        account: if let Some(account_id) = row.try_get("account_id").ok() {
            let account = Account {
                id: account_id,
                username: row.get("username"),
                password: row.get("password"),
                email: row.get("email"),
                rank: row.get("rank"),
                banned: row.get("banned"),
                ban_reason: row.get("ban_reason"),
                banned_at: row.get("banned_at"),
                created_at: row.get("account_created_at"),
                events: None,
            };

            match account_mapping_type {
                AccountMappingType::Full => Some(AccountInfo::Full(account)),
                AccountMappingType::Public => {
                    Some(AccountInfo::Public(PublicAccount::from(account)))
                }
                AccountMappingType::WithoutPassword => Some(AccountInfo::WithoutPassword(
                    AccountWithoutPassword::from(account),
                )),
            }
        } else {
            None
        },
    };

    event_with_account
}
