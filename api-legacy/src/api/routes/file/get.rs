use std::sync::Arc;

use axum::{
    extract::{Path, Request, State},
    http::{header, HeaderValue},
    response::Response,
};

use tower::ServiceExt;
use tower_http::services::{fs::ServeFileSystemResponseBody, ServeFile};
use uuid::Uuid;

use crate::api::AppState;

// TODO: handle unhappy cases
pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    request: Request,
) -> Response<ServeFileSystemResponseBody> {
    let repos = state.global.repos();

    let file = repos.file.fetch_one(id).await.unwrap();
    let mut response = ServeFile::new(file.path).oneshot(request).await.unwrap();

    response.headers_mut().insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("public, max-age=172800"),
    );

    response
}
