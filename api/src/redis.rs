pub async fn connect(url: &str) -> redis::Client {
    let client = redis::Client::open(url).expect("failed to open redis connection");

    log::info!("connected to redis");

    client
}
