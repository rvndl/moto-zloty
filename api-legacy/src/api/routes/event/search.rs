use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{api::AppState, api_error_log};

pub async fn handler(State(state): State<Arc<AppState>>, Path(query): Path<String>) -> Response {
    let repos = state.global.repos();

    let events = repos.event.search(&query).await;
    let events = match events {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to search events: {}", err),
    };

    Json(events).into_response()
}
