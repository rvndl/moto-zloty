use reqwest::Url;

pub struct RedisConnectionInfo {
    pub host: String,
    pub port: u16,
    pub user: Option<String>,
    pub database: Option<String>,
}

pub fn extract_connection_info(url_str: &str) -> RedisConnectionInfo {
    let url = Url::parse(url_str).expect("failed to parse URL");

    let host = url.host_str().expect("host not found in URL").to_string();
    let port = url.port_or_known_default().expect("port not found in URL");

    let user = if url.username().is_empty() {
        None
    } else {
        Some(url.username().to_string())
    };

    let database = match url.path().trim_start_matches('/') {
        "" => None,
        db => Some(db.to_string()),
    };

    RedisConnectionInfo {
        host,
        port,
        user,
        database,
    }
}
