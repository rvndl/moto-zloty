use std::sync::Arc;

use crate::api::AppState;
use crate::db::models::account::AccountMappingType;
use crate::db::models::event::EventStatus;
use crate::db::models::file::FileStatus;
use crate::jwt::JwtClaims;
use crate::utils::account::is_permitted;
use crate::{api_error, api_error_log};
use axum::extract::Path;
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

#[derive(serde::Deserialize, Debug)]
pub struct UpdateStatusForm {
    status: EventStatus,
}

pub async fn list(State(state): State<Arc<AppState>>) -> Response {
    let repos = state.global.repos();
    let events = match repos
        .event
        .fetch_all_with_accounts(AccountMappingType::Public, EventStatus::APPROVED)
        .await
    {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to fetch approved events: {}", err),
    };

    Json(events).into_response()
}

pub async fn list_all(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
) -> Response {
    if !is_permitted(claims.rank) {
        return api_error!("Brak uprawnień");
    }

    let repos = state.global.repos();
    let events = match repos.event.fetch_all().await {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to fetch approved events: {}", err),
    };

    Json(events).into_response()
}

pub async fn get(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();
    let event = match repos
        .event
        .fetch_by_id_with_account(id, AccountMappingType::Public)
        .await
    {
        Ok(event) => event,
        Err(err) => return api_error_log!("failed to fetch event: {}", err),
    };

    Json(event).into_response()
}

pub async fn actions(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    let actions = match repos.action.fetch_all_by_event_id(id).await {
        Ok(actions) => actions,
        Err(err) => return api_error_log!("failed to fetch actions: {}", err),
    };

    Json(actions).into_response()
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

    if let Err(err) = repos
        .action
        .create(
            event.id,
            user_id,
            claims.username,
            &EventStatus::PENDING.get_action_name(),
        )
        .await
    {
        return api_error_log!("failed to create action: {}", err);
    };

    Json(event).into_response()
}

pub async fn update_status(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    Extension(claims): Extension<JwtClaims>,
    Form(form): Form<UpdateStatusForm>,
) -> Response {
    if !is_permitted(claims.rank) {
        return api_error!("Brak uprawnień");
    }

    let repos = state.global.repos();

    let event = match repos.event.change_status(id, form.status.clone()).await {
        Ok(event) => event,
        Err(err) => return api_error_log!("failed to change event status: {}", err),
    };

    if let Err(err) = repos
        .action
        .create(
            event.id,
            claims.id,
            claims.username,
            &form.status.get_action_name(),
        )
        .await
    {
        return api_error_log!("failed to create action: {}", err);
    };

    Json(event).into_response()
}
