use crate::utils;

pub async fn connect(url: &str) -> redis::Client {
    log::info!("connecting to redis...");

    let client = match redis::Client::open(url) {
        Ok(client) => client,
        Err(err) => {
            log::error!("failed to open redis connection: {}", err);
            panic!("failed to open redis connection");
        }
    };

    log::info!("connected to redis");

    let connection_info = utils::redis::extract_connection_info(url);
    log::info!("\t - host: {}", connection_info.host);
    log::info!("\t - port: {}", connection_info.port);
    log::info!(
        "\t - user: {}\n",
        connection_info.user.unwrap_or("none".into())
    );

    client
}
