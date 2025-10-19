use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{api::AppState, api_error, place_search};

pub async fn handler(State(state): State<Arc<AppState>>, Path(query): Path<String>) -> Response {
    let places = match place_search::search(&query, state.global.clone()).await {
        Ok(places) => places,
        Err(err) => return api_error!("{}", err),
    };

    Json(places).into_response()
}
