use axum::{http::Response, response::IntoResponse};

pub async fn handler() -> impl IntoResponse {
    Response::builder()
        .status(200)
        .body("ok")
        .unwrap()
        .into_body()
}
