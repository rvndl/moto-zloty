use std::sync::Arc;

use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Extension, Json,
};

use crate::{
    api::AppState, api_error, api_error_log, jwt::JwtClaims, utils::account::is_permitted,
};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
) -> Response {
    if !is_permitted(claims.rank) {
        return api_error!("Brak uprawnień");
    }

    let repos = state.global.repos();

    let events = repos.event.fetch_all().await;
    let events = match events {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to fetch approved events: {}", err),
    };

    Json(events).into_response()
}
