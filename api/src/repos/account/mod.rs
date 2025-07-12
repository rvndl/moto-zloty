use crate::db;

pub mod create;
pub mod fetch;
pub mod update;

pub struct AccountRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> AccountRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }
}
