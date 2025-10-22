use std::sync::Arc;

use crate::global::Global;
use redis::AsyncCommands;
use reqwest::StatusCode;

const API_URL: &str = "https://eu1.locationiq.com/v1/autocomplete";
const MAX_RESULTS: u8 = 5;
const REDIS_KEY_PREFIX: &str = "place-search";

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct LocationIQAddress {
    pub name: Option<String>,
    pub house_number: Option<String>,
    pub road: Option<String>,
    pub neighbourhood: Option<String>,
    pub suburb: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct LocationIQPlace {
    pub place_id: String,
    pub lat: String,
    pub lon: String,
    pub address: LocationIQAddress,
}

pub async fn search(query: &str, global: Arc<Global>) -> Result<Vec<LocationIQPlace>, String> {
    let redis = global.redis();
    let mut redis_con = match redis.get_multiplexed_async_connection().await {
        Ok(redis_con) => redis_con,
        Err(err) => return Err(format!("failed to connect to redis: {err}")),
    };

    let query = query.to_ascii_lowercase();
    let cache_key = format!("{REDIS_KEY_PREFIX}:{query}");

    let results: Option<String> = redis_con.get(&cache_key).await.unwrap_or_default();
    if let Some(hit) = results {
        return match serde_json::from_str::<Vec<LocationIQPlace>>(&hit) {
            Ok(places) => Ok(places),
            Err(err) => Err(format!("failed to parse cache hit: {err}")),
        };
    }

    let location_iq_api_key = &global.config().location_iq_api_key;
    let request_url = format!(
        "{API_URL}?q={query}&accept-language=pl&countrycodes=pl&limit={MAX_RESULTS}&key={location_iq_api_key}"
    );

    let response = reqwest::get(request_url).await.unwrap();
    if response.status() != StatusCode::OK {
        return Err(format!(
            "failed to search places: got status code: {}",
            response.status()
        ));
    }

    let body = match response.text().await {
        Ok(body) => body,
        Err(err) => return Err(format!("failed to read response body: {err}")),
    };
    let _: () = redis_con.set(cache_key, &body).await.unwrap();

    match serde_json::from_str::<Vec<LocationIQPlace>>(&body) {
        Ok(places) => Ok(places),
        Err(err) => Err(format!("failed to parse response: {err}")),
    }
}

fn _make_address(address: LocationIQAddress) -> String {
    let mut new_address = String::new();

    if let Some(name) = address.name {
        new_address.push_str(&name);
    }

    if let Some(house_number) = address.house_number {
        new_address.push_str(", ");
        new_address.push_str(&house_number);
    }

    if let Some(road) = address.road {
        new_address.push_str(", ");
        new_address.push_str(&road);
    }

    if let Some(neighbourhood) = address.neighbourhood {
        new_address.push_str(", ");
        new_address.push_str(&neighbourhood);
    }

    if let Some(suburb) = address.suburb {
        new_address.push_str(", ");
        new_address.push_str(&suburb);
    }

    if let Some(city) = address.city {
        new_address.push_str(", ");
        new_address.push_str(&city);
    }

    if let Some(state) = address.state {
        new_address.push_str(", ");
        new_address.push_str(&state);
    }

    new_address
}
