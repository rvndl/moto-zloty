use reqwest::Url;
use sqlx::postgres::PgRow;

#[derive(serde::Deserialize, Debug)]
pub enum SortOrder {
    Asc,
    Desc,
}

impl SortOrder {
    pub fn to_str(&self) -> &str {
        match self {
            SortOrder::Asc => "ASC",
            SortOrder::Desc => "DESC",
        }
    }
}

pub fn has_any_or_error(query: Result<Vec<PgRow>, sqlx::Error>) -> bool {
    match query {
        Ok(rows) => rows.len() > 0,
        Err(_) => false,
    }
}

pub struct DBConnectionInfo {
    pub host: String,
    pub port: u16,
    pub user: String,
    pub database: String,
}

pub fn extract_db_connection_info(db_url: &str) -> DBConnectionInfo {
    let url = Url::parse(db_url).expect("failed to parse URL");

    let host = url.host_str().expect("host not found in URL").to_string();
    let port = url.port().expect("port not found in URL");
    let user = url.username().to_string();
    let database = url.path().trim_start_matches('/').to_string();

    DBConnectionInfo {
        host,
        port,
        user,
        database,
    }
}
