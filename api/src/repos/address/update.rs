use uuid::Uuid;

use crate::{db::models::address::Address, place_search::LocationIQAddress};

impl super::AddressRepo<'_> {
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
