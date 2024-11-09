use account::AccountRepo;
use event::EventRepo;
use file::FileRepo;

use crate::db;

pub mod account;
pub mod event;
pub mod file;

pub struct Repos<'a> {
    pub account: AccountRepo<'a>,
    pub event: EventRepo<'a>,
    pub file: FileRepo<'a>,
}

pub fn new(db: &db::DbPool) -> Repos {
    let account = AccountRepo::new(&db);
    let event = EventRepo::new(&db);
    let file = FileRepo::new(&db);

    Repos {
        account,
        event,
        file,
    }
}
