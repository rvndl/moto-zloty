use std::sync::Arc;

use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
    Json,
};
use chrono::{DateTime, Utc};

use crate::{
    api::AppState, api_error_log, db::models::event::EventStatus, repos::event::JoinEventFlags,
    utils::db::SortOrder,
};

#[derive(serde::Deserialize, Debug)]
pub struct PublicListFilters {
    date_from: Option<DateTime<Utc>>,
    date_to: Option<DateTime<Utc>>,
    sort_order: Option<SortOrder>,
    state: Option<String>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Query(filters): Query<PublicListFilters>,
) -> Response {
    let repos = state.global.repos();

    let PublicListFilters {
        date_from,
        date_to,
        sort_order,
        state,
    } = filters;

    let sort_order = sort_order.unwrap_or(SortOrder::Desc);

    let events = repos
        .event
        .fetch_all_joined(
            JoinEventFlags::Account | JoinEventFlags::AccountTypePublic | JoinEventFlags::Address,
            EventStatus::APPROVED,
            date_from,
            date_to,
            sort_order,
            state,
        )
        .await;

    let events = match events {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to fetch approved events: {}", err),
    };

    Json(events).into_response()
}
