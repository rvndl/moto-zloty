use super::macros::define_repo;

pub mod create;
pub mod fetch;
pub mod update;

define_repo!(AccountRepo);
