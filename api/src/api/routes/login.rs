use std::sync::Arc;

use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Form, Json,
};
use uuid::Uuid;

use crate::{
    api::AppState,
    api_error, api_error_log,
    config::Config,
    db::models::account::AccountRank,
    jwt, turnstile,
    validation::{RangeBoundary, RangeValidation, RangeValidationStatus},
};

const LOGIN_LENGTH_BOUNDARIES: RangeBoundary = (3, 32);
const PASSWORD_LENGTH_BOUNDARIES: RangeBoundary = (8, 64);

#[derive(serde::Deserialize, Debug)]
pub struct LoginForm {
    username: String,
    password: String,
    recaptcha: String,
}

#[derive(serde::Serialize, Debug, Default)]
struct LoginResponse {
    id: Uuid,
    username: String,
    rank: AccountRank,
    token: String,
}

pub async fn handler(State(state): State<Arc<AppState>>, Form(form): Form<LoginForm>) -> Response {
    match form.username.in_range(LOGIN_LENGTH_BOUNDARIES) {
        RangeValidationStatus::TooLong => {
            return api_error!("Podana nazwa użytkownika jest zbyt długa")
        }
        RangeValidationStatus::TooShort => {
            return api_error!("Podana nazwa użytkownika jest zbyt krótka")
        }
        _ => (),
    }

    match form.password.in_range(PASSWORD_LENGTH_BOUNDARIES) {
        RangeValidationStatus::TooLong => return api_error!("Podane hasło jest zbyt długie"),
        RangeValidationStatus::TooShort => return api_error!("Podane hasło jest zbyt krótkie"),
        _ => (),
    }

    let repos = state.global.repos();
    let Config {
        turnstile_secret, ..
    } = &state.global.config();

    if !turnstile::verify(turnstile_secret, &form.recaptcha).await {
        return api_error!("Weryfikacja Turnstile nie powiodła się");
    }

    let account = repos.account.fetch_by_username(&form.username).await;
    if account.is_err() {
        return api_error!("Podano błędny login lub hasło");
    }

    let account = match account {
        Ok(account) => account,
        Err(err) => return api_error_log!("failed to get account: {}", err),
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
