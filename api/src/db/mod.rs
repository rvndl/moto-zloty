use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

const MAX_CONNECTIONS: u32 = 1000;

pub mod models;

pub type DbPool = Pool<Postgres>;

pub async fn connect(db_url: &str) -> DbPool {
    let pool = PgPoolOptions::new()
        .max_connections(MAX_CONNECTIONS)
        .connect(db_url)
        .await
        .expect("failed to connect to the database");

    log::info!("connected to the database");

    pool
}
