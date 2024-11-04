use std::sync::Arc;

use crate::api_error_log;
use crate::jwt::JwtClaims;
use crate::{api::AppState, db::models::event::Event};
use axum::response::IntoResponse;
use axum::{extract::State, response::Response, Json};
use axum::{Extension, Form};

#[derive(serde::Deserialize, Debug)]
pub struct CreateForm {
    name: String,
    description: String,
    address: String,
    latitude: f64,
    longitude: f64,
}

#[derive(serde::Serialize, Debug)]
struct ListReponse {
    events: Vec<Event>,
}

pub async fn list(State(state): State<Arc<AppState>>) -> Response {
    let repos = state.global.repos();
    let events = repos.event.fetch_all().await.unwrap();

    Json(ListReponse { events }).into_response()
}

pub async fn create(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
    Form(form): Form<CreateForm>,
) -> Response {
    let user_id = claims.id;
    let repos = state.global.repos();

    let event = match repos
        .event
        .create(
            form.name,
            form.description,
            form.address,
            form.latitude,
            form.longitude,
            user_id,
        )
        .await
    {
        Ok(event) => event,
        Err(err) => return api_error_log!("failed to create event: {}", err),
    };

    Json(event).into_response()
}
