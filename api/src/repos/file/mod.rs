use super::macros::define_repo;

pub mod create;
pub mod delete;
pub mod fetch;
pub mod update;

define_repo!(FileRepo);
