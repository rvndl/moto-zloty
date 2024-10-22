use std::sync::Arc;

use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Form, Json,
};

use crate::{api::AppState, api_error, api_error_log, jwt};

#[derive(serde::Deserialize, Debug)]
pub struct Login {
    username: String,
    password: String,
}

#[derive(serde::Serialize, Debug, Default)]
struct LoginResponse {
    token: String,
}

pub async fn handler(State(state): State<Arc<AppState>>, Form(form): Form<Login>) -> Response {
    let repos = state.global.repos();
    let account = repos.account.fetch_by_username(form.username.clone()).await;

    if account.is_err() {
        return api_error!("account with that username does not exist");
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
                let token = match jwt::sign(form.username, account.rank) {
                    Ok(token) => token,
                    Err(err) => return api_error_log!("failed to create jwt token: {}", err),
                };

                Json(LoginResponse { token }).into_response()
            }
            Err(_) => return api_error!("invalid password"),
        },
        Err(err) => return api_error_log!("failed to hash the password: {}", err),
    }
}
