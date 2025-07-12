use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::{api::AppState, api_error_log, repos::event::helpers::JoinEventFlags};

pub async fn handler(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    let event = repos
        .event
        .fetch_by_id_joined(
            id,
            JoinEventFlags::Account | JoinEventFlags::Address | JoinEventFlags::AccountTypePublic,
        )
        .await;

    let event = match event {
        Ok(event) => event,
        Err(err) => return api_error_log!("failed to fetch event: {}", err),
    };

    Json(event).into_response()
}
