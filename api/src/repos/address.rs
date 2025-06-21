use uuid::Uuid;

use crate::{
    db::{self, models::address::Address},
    place_search::LocationIQAddress,
};

pub struct AddressRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> AddressRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }

    pub async fn create(&self, address: LocationIQAddress) -> Result<Address, sqlx::Error> {
        let result = sqlx::query_as::<_, Address>(
            r#"INSERT INTO address (name, house_number, road, neighbourhood, suburb, city, state) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"#,
        )
        .bind(address.name)
        .bind(address.house_number)
        .bind(address.road)
        .bind(address.neighbourhood)
        .bind(address.suburb)
        .bind(address.city)
        .bind(address.state)
        .fetch_one(self.db)
        .await;

        result
    }

    pub async fn update(
        &self,
        id: Uuid,
        address: LocationIQAddress,
    ) -> Result<Address, sqlx::Error> {
        let result = sqlx::query_as::<_, Address>(
            r#"UPDATE address SET name = $1, house_number = $2, road = $3, neighbourhood = $4, suburb = $5, city = $6, state = $7 WHERE id = $8 RETURNING *"#,
        )
        .bind(address.name)
        .bind(address.house_number)
        .bind(address.road)
        .bind(address.neighbourhood)
        .bind(address.suburb)
        .bind(address.city)
        .bind(address.state)
        .bind(id)
        .fetch_one(self.db)
        .await;

        result
    }
}
