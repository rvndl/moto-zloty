use crate::db;

pub mod create;
pub mod fetch;
pub mod fetch_joined;
pub mod helpers;
pub mod search;
pub mod update;

pub struct EventRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> EventRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }
}
