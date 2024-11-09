use std::sync::Arc;

use crate::api::AppState;
use crate::api_error;
use crate::db::models::account::{Account, PublicAccount};
use axum::extract::Path;
use axum::response::IntoResponse;
use axum::{extract::State, response::Response, Json};
use uuid::Uuid;

pub async fn get_profile(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    match repos.account.fetch_one(id).await {
        Ok(account) => {
            let events = repos
                .event
                .fetch_by_account_id(account.id.clone())
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
