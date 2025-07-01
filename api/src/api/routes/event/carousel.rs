use std::sync::Arc;

use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};

use crate::{api::AppState, api_error};

pub async fn handler(State(state): State<Arc<AppState>>) -> Response {
    let repos = state.global.repos();

    let events = repos.event.fetch_all_carousel().await;
    let events = match events {
        Ok(events) => events,
        Err(err) => {
            log::error!("failed to fetch carousel events: {}", err);
            return api_error!("Wystąpił błąd podczas pobierania wydarzeń karuzeli");
        }
    };

    Json(events).into_response()
}
