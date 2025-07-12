use std::sync::Arc;

use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};

use crate::{api::AppState, api_error_log};

pub async fn handler(State(state): State<Arc<AppState>>) -> Response {
    let repos = state.global.repos();

    let events = repos.event.fetch_list_by_state_joined().await;

    let events = match events {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to fetch list by state events: {}", err),
    };

    Json(events).into_response()
}
