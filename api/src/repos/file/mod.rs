use crate::db;

pub mod create;
pub mod delete;
pub mod fetch;
pub mod update;

pub struct FileRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> FileRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }
}
