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

    let events = repos
        .event
        .fetch_all_joined(FetchAllJoinedParams {
            flags: JoinEventFlags::Account
                | JoinEventFlags::AccountTypePublic
                | JoinEventFlags::Address,
            status: EventStatus::APPROVED,
            date_from,
            date_to,
            sort_order,
            state,
        })
        .await;

    let events = match events {
        Ok(events) => events,
        Err(err) => {
            log::error!("failed to fetch list of events: {err}");
            return api_error!("Wystąpił błąd podczas pobierania wydarzeń.");
        }
    };

    Json(events).into_response()
}
