use crate::place_search::LocationIQAddress;

pub mod actions;
pub mod carousel;
pub mod create;
pub mod details;
pub mod list;
pub mod list_by_state;
pub mod list_moderation;
pub mod list_related;
pub mod list_sitemap;
pub mod map;
pub mod refine_description;
pub mod search;
pub mod update_address;
pub mod update_status;

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct AliasedLocationIQAddress {
    #[serde(rename = "address[name]")]
    pub name: Option<String>,

    #[serde(rename = "address[house_number]")]
    pub house_number: Option<String>,

    #[serde(rename = "address[road]")]
    pub road: Option<String>,

    #[serde(rename = "address[neighbourhood]")]
    pub neighbourhood: Option<String>,

    #[serde(rename = "address[suburb]")]
    pub suburb: Option<String>,

    #[serde(rename = "address[city]")]
    pub city: Option<String>,

    #[serde(rename = "address[state]")]
    pub state: Option<String>,
}

impl Into<LocationIQAddress> for AliasedLocationIQAddress {
    fn into(self) -> LocationIQAddress {
        LocationIQAddress {
            name: self.name,
            house_number: self.house_number,
            road: self.road,
            neighbourhood: self.neighbourhood,
            suburb: self.suburb,
            city: self.city,
            state: self.state,
        }
    }
}
