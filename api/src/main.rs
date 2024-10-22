use std::sync::Arc;

use global::Global;
use tokio::select;

pub mod api;
pub mod config;
pub mod db;
pub mod env;
pub mod global;
pub mod jwt;
pub mod logger;
pub mod repos;
pub mod utils;

#[tokio::main]
async fn main() -> Result<(), ()> {
    logger::setup().expect("failed setting up the logger");
    let global = Arc::new(Global::new().await);

    let api_hander = tokio::spawn(api::run(global.clone()));

    select! {
        r = api_hander => println!("api error: {:?}", r)
    }

    drop(global);

    Ok(())
}
