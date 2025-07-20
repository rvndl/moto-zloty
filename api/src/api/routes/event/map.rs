use std::sync::Arc;

use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
    Json,
};
use chrono::{DateTime, Utc};

use crate::{
    api::AppState,
    api_error,
    db::models::event::EventStatus,
    repos::event::{fetch_joined::FetchAllJoinedParams, helpers::JoinEventFlags},
};

#[derive(serde::Deserialize, Debug)]
pub struct MapFilters {
    date_from: Option<DateTime<Utc>>,
    date_to: Option<DateTime<Utc>>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Query(filters): Query<MapFilters>,
) -> Response {
    let repos = state.global.repos();

    let MapFilters { date_from, date_to } = filters;

    let events = repos
        .event
        .fetch_all_joined(FetchAllJoinedParams {
            flags: JoinEventFlags::None | JoinEventFlags::Address,
            status: EventStatus::APPROVED,
            date_from,
            date_to,
            sort_order: None,
            state: None,
            show_expired: false,
        })
        .await;

    let events = match events {
        Ok(events) => events,
        Err(err) => {
            log::error!("failed to fetch map events: {err}");
            return api_error!("Wystąpił błąd podczas pobierania wydarzeń.");
        }
    };

    Json(events).into_response()
}
