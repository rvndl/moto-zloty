use std::sync::Arc;

use axum::{
    extract::{Multipart, State},
    response::{IntoResponse, Response},
    Json,
};

use tokio::{
    fs::{self, File},
    io::AsyncWriteExt,
};
use uuid::Uuid;

use crate::{api::AppState, api_error, api_error_log, image_processor::convert::convert_image};

#[derive(Debug, serde::Serialize)]
struct UploadReponse {
    full_id: Uuid,
    small_id: Option<Uuid>,
}

const ACCEPTED_CONTENT_TYPES: [&str; 4] = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
const FOUR_MB: i32 = 1024 * 1024 * 4;

// TODO: decide if we want to encode small images
pub async fn handler(State(state): State<Arc<AppState>>, mut multipart: Multipart) -> Response {
    let upload_path = &state.global.config().upload_path;
    let repos = state.global.repos();

    if let Some(field) = multipart.next_field().await.unwrap() {
        let file_name = field.file_name().unwrap().to_string();
        let file_ext = file_name.split('.').last().unwrap();

        let content_type = field.content_type().unwrap().to_string();
        let data = field.bytes().await.unwrap();

        if !ACCEPTED_CONTENT_TYPES.contains(&content_type.as_str()) {
            return api_error_log!("Nieprawidłowy typ pliku.");
        }

        if data.len() as i32 > FOUR_MB {
            return api_error!("Rozmiar pliku jest za duży.");
        }

        let uuid = Uuid::new_v4();
        let file_name = format!("{uuid}.{file_ext}");
        let save_path = format!("{upload_path}/{file_name}");

        let file = File::create(&save_path).await;

        let mut file = match file {
            Ok(file) => file,
            Err(err) => {
                log::error!("failed to create file: {err}");
                return api_error!("Wystąpił błąd podczas wgrywania pliku, spróbuj ponownie.");
            }
        };

        if let Err(err) = file.write_all(&data).await {
            return api_error_log!("failed to write file: {err}");
        }
        if let Err(err) = file.flush().await {
            log::error!("failed to flush file: {err}");
            return api_error!("Wystąpił błąd podczas wgrywania pliku, spróbuj ponownie.");
        }
        drop(file);

        let full_image = convert_image(&save_path, false);
        let full_image = match full_image {
            Ok(path) => path,
            Err(err) => {
                log::error!("failed to convert file to .webp: {err}");
                return api_error!(
                    "Wystąpił błąd podczas konwersji pliku do .webp. Spróbuj ponownie."
                );
            }
        };

        let small_image = convert_image(&save_path, false);
        let small_image = match small_image {
            Ok(path) => path,
            Err(err) => {
                log::error!("failed to convert file to .webp: {err}");
                return api_error!(
                    "Wystąpił błąd podczas konwersji mniejszego pliku do .webp. Spróbuj ponownie."
                );
            }
        };

        let full_image_file = match repos.file.create(&full_image).await {
            Ok(file) => file,
            Err(err) => return api_error_log!("failed to create full image file: {err}"),
        };

        let small_image_file = match repos.file.create(&small_image).await {
            Ok(file) => file,
            Err(err) => return api_error_log!("failed to create small image file: {err}"),
        };

        if let Err(err) = fs::remove_file(save_path).await {
            log::error!("failed to remove file: {err}");
        }

        return Json(UploadReponse {
            full_id: full_image_file.id,
            small_id: Some(small_image_file.id),
        })
        .into_response();
    }

    api_error!("no file found")
}
