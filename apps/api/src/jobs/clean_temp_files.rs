use std::{str::FromStr, sync::Arc};

use chrono::Utc;
use cron::Schedule;
use tokio::time::sleep;

use crate::{db::models::file::FileStatus, global::Global};

const EVERY_30_MINUTES: &str = "0,30 * * * * *";

pub async fn run(global: Arc<Global>) {
    let schedule = Schedule::from_str(EVERY_30_MINUTES).unwrap();

    loop {
        let now = Utc::now();
        if let Some(next) = schedule.upcoming(Utc).take(1).next() {
            let until_next = next - now;

            let repos = global.repos();
            let temp_files = match repos.file.fetch_all_by_status(FileStatus::TEMPORARY).await {
                Ok(file) => file,
                Err(err) => {
                    log::error!("failed to fetch temporary files: {}", err);
                    continue;
                }
            };

            for file in temp_files {
                let now = Utc::now();
                if file.created_at + chrono::Duration::minutes(30) < now {
                    match repos.file.delete(file.id).await {
                        Ok(_) => log::info!("deleted temporary file: {}", file.path),
                        Err(err) => log::error!("failed to delete temporary file: {}", err),
                    }
                }
            }

            sleep(until_next.to_std().unwrap()).await;
        }
    }
}
