use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::{api::AppState, api_error_log};

pub async fn handler(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    let actions = repos.action.fetch_all_by_event_id(id).await;
    let actions = match actions {
        Ok(actions) => actions,
        Err(err) => return api_error_log!("failed to fetch actions: {}", err),
    };

    Json(actions).into_response()
}
