use account::AccountRepo;
use event::EventRepo;

use crate::db;

pub mod account;
pub mod event;

pub struct Repos<'a> {
    pub account: AccountRepo<'a>,
    pub event: EventRepo<'a>,
}

pub fn new(db: &db::DbPool) -> Repos {
    let account = AccountRepo::new(&db);
    let event = EventRepo::new(&db);

    Repos { account, event }
}
