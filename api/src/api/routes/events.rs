use std::sync::Arc;

use crate::api_error_log;
use crate::db::models::account::AccountMappingType;
use crate::db::models::file::FileStatus;
use crate::jwt::JwtClaims;
use crate::{api::AppState, db::models::event::Event};
use axum::response::IntoResponse;
use axum::{extract::State, response::Response, Json};
use axum::{Extension, Form};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(serde::Deserialize, Debug)]
pub struct CreateForm {
    name: String,
    description: Option<String>,
    address: String,
    latitude: f64,
    longitude: f64,
    date_from: String,
    date_to: String,
    banner_id: Option<Uuid>,
}

pub async fn list(State(state): State<Arc<AppState>>) -> Response {
    let repos = state.global.repos();
    let events = match repos
        .event
        .fetch_all_with_accounts(AccountMappingType::Public)
        .await
    {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to fetch events: {}", err),
    };

    Json(events).into_response()
}

pub async fn create(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
    Form(form): Form<CreateForm>,
) -> Response {
    let user_id = claims.id;
    let repos = state.global.repos();

    let date_from: DateTime<Utc> = form.date_from.parse::<DateTime<Utc>>().unwrap().to_utc();
    let date_to = form.date_to.parse::<DateTime<Utc>>().unwrap().to_utc();

    let event = match repos
        .event
        .create(
            form.name,
            form.description,
            form.address,
            form.latitude,
            form.longitude,
            date_from,
            date_to,
            form.banner_id,
            user_id,
        )
        .await
    {
        Ok(event) => event,
        Err(err) => return api_error_log!("failed to create event: {}", err),
    };

    if let Some(banner_id) = event.banner_id {
        if let Err(err) = repos
            .file
            .change_status(banner_id, FileStatus::PERMANENT)
            .await
        {
            return api_error_log!("failed to change file status: {}", err);
        }
    };

    Json(event).into_response()
}
