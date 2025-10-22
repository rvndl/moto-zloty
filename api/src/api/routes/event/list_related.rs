use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use uuid::Uuid;

use crate::{api::AppState, api_error_log, db::models::event::Event};

#[derive(Debug, Serialize)]
struct RelatedResponse {
    related_by_month: Vec<Event>,
    related_by_state: Vec<Event>,
}

pub async fn handler(
    State(app_state): State<Arc<AppState>>,
    Path((id, month, state)): Path<(Uuid, i32, String)>,
) -> Response {
    let repos = app_state.global.repos();

    let related_by_month = repos.event.fetch_six_by_month(month, id).await;
    let related_by_month = match related_by_month {
        Ok(related_by_month) => related_by_month,
        Err(err) => return api_error_log!("failed to fetch related by month events: {}", err),
    };

    let related_by_state = repos.event.fetch_six_by_state(state, id).await;
    let related_by_state = match related_by_state {
        Ok(related_by_state) => related_by_state,
        Err(err) => return api_error_log!("failed to fetch related by state events: {}", err),
    };

    Json(RelatedResponse {
        related_by_month,
        related_by_state,
    })
    .into_response()
}
