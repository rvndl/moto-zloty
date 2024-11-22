use std::sync::Arc;

use crate::global::Global;

pub mod clean_temp_files;

pub async fn run(global: Arc<Global>) {
    clean_temp_files::run(global.clone()).await;
}
