use crate::db;

pub mod create;
pub mod fetch;

pub struct ActionRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> ActionRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }
}
