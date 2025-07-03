use std::sync::Arc;

use crate::api::AppState;
use crate::db::models::event::EventStatus;
use crate::db::models::file::FileStatus;
use crate::jwt::JwtClaims;
use crate::{api_error, api_error_log};
use axum::response::IntoResponse;
use axum::{extract::State, response::Response, Json};
use axum::{Extension, Form};
use chrono::{DateTime, Utc};
use uuid::Uuid;

use super::AliasedLocationIQAddress;

#[derive(serde::Deserialize, Debug)]
pub struct CreateForm {
    name: String,
    description: Option<String>,

    #[serde(flatten)]
    address: Option<AliasedLocationIQAddress>,
    lat: f64,
    lon: f64,
    date_from: String,
    date_to: String,
    banner_id: Option<Uuid>,
    banner_small_id: Option<Uuid>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
    Form(form): Form<CreateForm>,
) -> Response {
    let user_id = claims.id;
    let repos = state.global.repos();

    let address = repos.address.create(form.address.unwrap().into()).await;
    let address = match address {
        Ok(address) => address,
        Err(err) => {
            log::error!("failed to create address: {}", err);
            return api_error!("Wystąpił błąd podczas tworzenia adresu, spróbuj ponownie");
        }
    };

    let date_from: DateTime<Utc> = form
        .date_from
        .parse::<DateTime<Utc>>()
        .expect("failed to parse the field date_from")
        .to_utc();

    let date_to = form
        .date_to
        .parse::<DateTime<Utc>>()
        .expect("failed to parse the field date_to")
        .to_utc();

    let event = match repos
        .event
        .create(
            &form.name,
            form.description,
            None,
            address.id,
            form.lat,
            form.lon,
            date_from,
            date_to,
            form.banner_id,
            form.banner_small_id,
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

    if let Some(banner_small_id) = event.banner_small_id {
        if let Err(err) = repos
            .file
            .change_status(banner_small_id, FileStatus::PERMANENT)
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
            &claims.username,
            &EventStatus::PENDING.get_action_name(),
        )
        .await
    {
        return api_error_log!("failed to create action: {}", err);
    };

    Json(event).into_response()
}
