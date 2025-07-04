use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::{
    api::AppState,
    api_error,
    db::models::account::{Account, PublicAccount},
};

pub async fn handler(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    match repos.account.fetch_one(id).await {
        Ok(account) => {
            let events = repos
                .event
                .fetch_by_account_id(account.id)
                .await
                .unwrap_or_default();

            if events.is_empty() {
                return Json(PublicAccount::from(account)).into_response();
            }

            Json(PublicAccount::from(Account {
                events: Some(events),
                ..account
            }))
            .into_response()
        }
        Err(_) => api_error!("Nie znaleziono profilu"),
    }
}
