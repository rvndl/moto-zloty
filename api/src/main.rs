use std::sync::Arc;

use global::Global;
use tokio::select;

pub mod api;
pub mod config;
pub mod db;
pub mod env;
pub mod global;
pub mod jobs;
pub mod jwt;
pub mod logger;
pub mod place_search;
pub mod redis;
pub mod repos;
pub mod turnstile;
pub mod utils;
pub mod validation;

#[tokio::main]
async fn main() -> Result<(), ()> {
    logger::setup().expect("failed setting up the logger");
    let global = Arc::new(Global::new().await);

    let api_hander = tokio::spawn(api::run(global.clone()));
    let jobs_hander = tokio::spawn(jobs::run(global.clone()));

    select! {
        r = api_hander => println!("api error: {:?}", r),
        r = jobs_hander => println!("jobs error: {:?}", r)
    }

    drop(global);

    Ok(())
}
