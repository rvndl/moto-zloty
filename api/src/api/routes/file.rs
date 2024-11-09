use std::sync::Arc;

use axum::{
    extract::{Multipart, Path, Request, State},
    response::{IntoResponse, Response},
    Json,
};

use tokio::{fs::File, io::AsyncWriteExt};
use tower::ServiceExt;
use tower_http::services::{fs::ServeFileSystemResponseBody, ServeFile};
use uuid::Uuid;

use crate::{api::AppState, api_error, api_error_log};

#[derive(Debug, serde::Serialize)]
struct UploadReponse {
    id: Uuid,
}

const ACCEPTED_CONTENT_TYPES: [&str; 4] = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
const TWO_MB: i32 = 1024 * 1024 * 2;

pub async fn upload(State(state): State<Arc<AppState>>, mut multipart: Multipart) -> Response {
    let upload_path = &state.global.config().upload_path;
    let repos = state.global.repos();

    while let Some(field) = multipart.next_field().await.unwrap() {
        let file_name = field.file_name().unwrap().to_string();
        let file_ext = file_name.split('.').last().unwrap();

        let content_type = field.content_type().unwrap().to_string();
        let data = field.bytes().await.unwrap();

        if !ACCEPTED_CONTENT_TYPES.contains(&content_type.as_str()) {
            return api_error_log!("invalid content type");
        }

        if data.len() as i32 > TWO_MB {
            return api_error!("file is too big");
        }

        let uuid = Uuid::new_v4();
        let file_name = format!("{}.{}", uuid, file_ext);
        let save_path = format!("{}/{}", upload_path, file_name);

        let file = File::create(&save_path).await;
        if let Ok(mut file) = file {
            if let Err(err) = file.write_all(&data).await {
                return api_error_log!("failed to write file: {}", err);
            }

            let file = match repos.file.create(save_path).await {
                Ok(file) => file,
                Err(err) => return api_error_log!("failed to create file: {}", err),
            };

            return Json(UploadReponse { id: file.id }).into_response();
        }

        return api_error!("failed to create file");
    }

    api_error!("no file found")
}

// TODO: handle unhappy cases
pub async fn get_file(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    request: Request,
) -> Response<ServeFileSystemResponseBody> {
    let repos = state.global.repos();

    let file = repos.file.fetch_one(id).await.unwrap();
    let response = ServeFile::new(file.path).oneshot(request).await.unwrap();
    return response;
}
