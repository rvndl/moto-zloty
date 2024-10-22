use crate::{
    config::Config,
    db,
    repos::{self, Repos},
};

pub struct Global {
    config: Config,
    db: db::DbPool,
}

impl Global {
    pub async fn new() -> Self {
        let config = Config::new();
        let db = db::connect(&config.db_url).await;

        Global { config, db }
    }

    pub fn config(&self) -> &Config {
        &self.config
    }

    pub fn repos(&self) -> Repos {
        repos::new(&self.db)
    }
}
