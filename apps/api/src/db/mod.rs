use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

use crate::utils;

const MAX_CONNECTIONS: u32 = 1000;

pub mod models;

pub type DbPool = Pool<Postgres>;

pub async fn connect(db_url: &str) -> DbPool {
    log::info!("connecting to the database...");
    let pool = match PgPoolOptions::new()
        .max_connections(MAX_CONNECTIONS)
        .connect(db_url)
        .await
    {
        Ok(pool) => pool,
        Err(err) => {
            log::error!("failed to connect to the database: {}", err);
            panic!("failed to connect to the database");
        }
    };

    log::info!("connected to the database");

    let connection_info = utils::db::extract_db_connection_info(db_url);
    log::info!("\t- host: {}", connection_info.host);
    log::info!("\t- port: {}", connection_info.port);
    log::info!("\t- user: {}", connection_info.user);
    log::info!("\t- database: {}\n", connection_info.database);

    pool
}
