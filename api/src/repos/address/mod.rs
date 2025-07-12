use crate::db;

pub mod create;
pub mod update;

pub struct AddressRepo<'a> {
    db: &'a db::DbPool,
}

impl<'a> AddressRepo<'a> {
    pub fn new(db: &'a db::DbPool) -> Self {
        Self { db }
    }
}
