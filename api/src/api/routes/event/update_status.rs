use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Extension, Form, Json,
};
use uuid::Uuid;

use crate::{
    api::AppState, api_error, api_error_log, db::models::event::EventStatus, jwt::JwtClaims,
    utils::account::is_permitted,
};

#[derive(serde::Deserialize, Debug)]
pub struct UpdateStatusForm {
    status: EventStatus,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    Extension(claims): Extension<JwtClaims>,
    Form(form): Form<UpdateStatusForm>,
) -> Response {
    if !is_permitted(claims.rank) {
        return api_error!("Brak uprawnień");
    }

    let repos = state.global.repos();

    let event = repos.event.change_status(id, form.status.clone()).await;
    let event = match event {
        Ok(event) => event,
        Err(err) => return api_error_log!("failed to change event status: {}", err),
    };

    if let Err(err) = repos
        .action
        .create(
            event.id,
            claims.id,
            &claims.username,
            &form.status.get_action_name(),
        )
        .await
    {
        return api_error_log!("failed to create action: {}", err);
    };

    Json(event).into_response()
}
