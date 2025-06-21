use crate::{
    config::Config,
    db, redis,
    repos::{self, Repos},
};

pub struct Global {
    config: Config,
    db: db::DbPool,
    redis: ::redis::Client,
}

impl Global {
    pub async fn new() -> Self {
        let config = Config::new();
        let db = db::connect(&config.db_url).await;
        let redis = redis::connect(&config.redis_url).await;

        Global { config, db, redis }
    }

    pub fn config(&self) -> &Config {
        &self.config
    }

    pub fn redis(&self) -> &::redis::Client {
        &self.redis
    }

    pub fn repos(&self) -> Repos {
        repos::new(&self.db)
    }
}
