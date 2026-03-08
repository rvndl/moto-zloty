use crate::{db::models::address::Address, place_search::LocationIQAddress};

impl super::AddressRepo<'_> {
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
}
