use std::sync::Arc;

use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Form, Json,
};
use uuid::Uuid;

use crate::{api::AppState, api_error, api_error_log, db::models::account::AccountRank, jwt};

#[derive(serde::Deserialize, Debug)]
pub struct LoginForm {
    username: String,
    password: String,
}

#[derive(serde::Serialize, Debug, Default)]
struct LoginResponse {
    id: Uuid,
    username: String,
    rank: AccountRank,
    token: String,
}

pub async fn handler(State(state): State<Arc<AppState>>, Form(form): Form<LoginForm>) -> Response {
    let repos = state.global.repos();
    let account = repos.account.fetch_by_username(form.username.clone()).await;

    if account.is_err() {
        return api_error!("Podano błędny login lub hasło");
    }

    let account = match account {
        Ok(account) => account,
        Err(err) => {
            return api_error_log!("failed to get account: {}", err);
        }
    };

    let argon2 = Argon2::default();
    match PasswordHash::new(&account.password) {
        Ok(hash) => match argon2.verify_password(form.password.as_str().as_bytes(), &hash) {
            Ok(_) => {
                let token = match jwt::sign(account.id, &form.username, &account.rank) {
                    Ok(token) => token,
                    Err(err) => return api_error_log!("failed to create jwt token: {}", err),
                };

                Json(LoginResponse {
                    id: account.id,
                    username: form.username,
                    rank: account.rank,
                    token,
                })
                .into_response()
            }
            Err(_) => return api_error!("Podano błędny login lub hasło"),
        },
        Err(err) => return api_error_log!("failed to hash the password: {}", err),
    }
}
