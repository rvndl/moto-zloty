use account::AccountRepo;
use action::ActionRepo;
use event::EventRepo;
use file::FileRepo;

use crate::db;

pub mod account;
pub mod action;
pub mod event;
pub mod file;

pub struct Repos<'a> {
    pub account: AccountRepo<'a>,
    pub event: EventRepo<'a>,
    pub file: FileRepo<'a>,
    pub action: ActionRepo<'a>,
}

pub fn new(db: &db::DbPool) -> Repos {
    let account = AccountRepo::new(&db);
    let event = EventRepo::new(&db);
    let file = FileRepo::new(&db);
    let action = ActionRepo::new(&db);

    Repos {
        account,
        event,
        file,
        action,
    }
}
