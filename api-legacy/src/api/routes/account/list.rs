use std::sync::Arc;

use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Extension, Json,
};

use crate::{
    api::AppState, api_error, db::models::account::AccountWithoutPassword, jwt::JwtClaims,
    utils::account::is_permitted,
};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
) -> Response {
    if !is_permitted(claims.rank) {
        return api_error!("Brak uprawnień");
    }

    let repos = state.global.repos();
    let accounts: Vec<AccountWithoutPassword> = match repos.account.fetch_all().await {
        Ok(accounts) => accounts
            .into_iter()
            .map(AccountWithoutPassword::from)
            .collect(),
        Err(err) => {
            log::error!("could not fetch accounts: {}", err);
            return api_error!("Nie udało się pobrać listy użytkowników");
        }
    };

    Json(accounts).into_response()
}
