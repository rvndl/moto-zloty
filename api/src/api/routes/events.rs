use std::sync::Arc;

use crate::{api::AppState, db::models::event::Event};
use axum::response::IntoResponse;
use axum::{extract::State, response::Response, Json};

#[derive(serde::Serialize, Debug)]
struct EventsResponse {
    events: Vec<Event>,
}

pub async fn handler(State(state): State<Arc<AppState>>) -> Response {
    let repos = state.global.repos();
    let events = repos.event.fetch_all().await.unwrap();

    Json(EventsResponse { events }).into_response()
}
