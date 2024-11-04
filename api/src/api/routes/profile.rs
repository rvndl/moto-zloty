use std::sync::Arc;

use crate::api::AppState;
use crate::api_error;
use crate::db::models::account::PublicAccount;
use axum::extract::Path;
use axum::response::IntoResponse;
use axum::{extract::State, response::Response, Json};
use uuid::Uuid;

pub async fn get_profile(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    match repos.account.fetch_one(id).await {
        Ok(account) => Json(PublicAccount::from(account)).into_response(),
        Err(_) => api_error!("Nie znaleziono profilu"),
    }
}
