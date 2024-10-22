use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2,
};
use std::sync::Arc;

use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Form, Json,
};

use crate::{api::AppState, api_error, api_error_log, db::models::account::AccountRank, jwt};

#[derive(serde::Deserialize, Debug)]
pub struct Register {
    username: String,
    password: String,
    email: String,
}

#[derive(serde::Serialize, Debug, Default)]
struct RegisterResponse {
    token: String,
}

pub async fn handler(State(state): State<Arc<AppState>>, Form(form): Form<Register>) -> Response {
    let repos = state.global.repos();
    if repos.account.exists_username(form.username.clone()).await {
        return api_error!("account with that username already exists");
    }

    if repos.account.exists_email(form.email.clone()).await {
        return api_error!("account with that email already exists");
    };

    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    match argon2.hash_password(form.password.as_str().as_bytes(), &salt) {
        Ok(password_hash) => {
            if let Err(err) = repos
                .account
                .create(form.username.clone(), password_hash.to_string(), form.email)
                .await
            {
                return api_error_log!("failed to create account: {}", err);
            }
        }
        Err(err) => return api_error_log!("failed to hash the password: {}", err),
    }

    let token = match jwt::sign(form.username, AccountRank::USER) {
        Ok(token) => token,
        Err(err) => return api_error_log!("failed to create jwt token: {}", err),
    };

    Json(RegisterResponse { token }).into_response()
}
