use super::macros::define_repo;

pub mod create;
pub mod fetch;
pub mod fetch_joined;
pub mod helpers;
pub mod search;
pub mod update;

define_repo!(EventRepo);
