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
    id: i32,
    username: String,
    token: String,
    rank: AccountRank,
}

pub async fn handler(State(state): State<Arc<AppState>>, Form(form): Form<Register>) -> Response {
    let repos = state.global.repos();
    if repos.account.exists_username(form.username.clone()).await {
        return api_error!("Konto z taką nazwą użytkownika już istnieje");
    }

    if repos.account.exists_email(form.email.clone()).await {
        return api_error!("Konto z takim adresem e-mail już istnieje");
    };

    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    let id: i32;

    match argon2.hash_password(form.password.as_str().as_bytes(), &salt) {
        Ok(password_hash) => {
            match repos
                .account
                .create(form.username.clone(), password_hash.to_string(), form.email)
                .await
            {
                Ok(account) => {
                    id = account.id;
                }
                Err(err) => {
                    return api_error_log!("failed to create account: {}", err);
                }
            }
        }
        Err(err) => return api_error_log!("failed to hash the password: {}", err),
    }

    let default_rank = AccountRank::USER;
    let token = match jwt::sign(&form.username, &default_rank) {
        Ok(token) => token,
        Err(err) => return api_error_log!("failed to create jwt token: {}", err),
    };

    Json(RegisterResponse {
        id,
        username: form.username,
        rank: default_rank,
        token,
    })
    .into_response()
}
