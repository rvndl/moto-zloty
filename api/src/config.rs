use dotenv::dotenv;

use crate::env::Env;

#[derive(Debug)]
pub struct Config {
    pub db_url: String,
}

impl Config {
    pub fn new() -> Self {
        if let Err(err) = dotenv() {
            log::error!("failed to parse .env file: {}, exiting ...", err);
            std::process::exit(0);
        };

        let db_url = Env::new("DATABASE_URL", true, |val| val).get();

        Config { db_url }
    }
}
