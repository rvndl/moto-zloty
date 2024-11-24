use crate::api::AppState;
use crate::api_error;
use crate::db::models::account::{Account, PublicAccount};
use crate::jwt::JwtClaims;
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::SaltString;
use argon2::{password_hash::PasswordHasher, Argon2};
use argon2::{PasswordHash, PasswordVerifier};
use axum::extract::Path;
use axum::response::IntoResponse;
use axum::{extract::State, response::Response, Json};
use axum::{Extension, Form};
use std::sync::Arc;
use uuid::Uuid;

#[derive(serde::Deserialize, Debug)]
pub struct ChangePasswordForm {
    current_password: String,
    new_password: String,
    confirm_password: String,
}

pub async fn get_profile(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    match repos.account.fetch_one(id).await {
        Ok(account) => {
            let events = repos
                .event
                .fetch_by_account_id(account.id.clone())
                .await
                .unwrap_or_default();

            if events.is_empty() {
                return Json(PublicAccount::from(account)).into_response();
            }

            Json(PublicAccount::from(Account {
                events: Some(events),
                ..account
            }))
            .into_response()
        }
        Err(_) => api_error!("Nie znaleziono profilu"),
    }
}

pub async fn change_password(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
    Form(form): Form<ChangePasswordForm>,
) -> Response {
    if form.new_password != form.confirm_password {
        return api_error!("Hasła muszą być takie same");
    }

    let user_id = claims.id;
    let repos = state.global.repos();

    let account = match repos.account.fetch_one(user_id).await {
        Ok(account) => account,
        Err(err) => {
            log::error!("could not fetch account using session id: {}", err);
            return api_error!("Nie udało się pobrać danych użytkownika");
        }
    };

    let argon2 = Argon2::default();
    let hash = match PasswordHash::new(&account.password) {
        Ok(hash) => hash,
        Err(err) => {
            log::error!("could not convert the password: {}", err);
            return api_error!("Nie udało się przekonwertować hasła");
        }
    };

    match argon2.verify_password(&form.current_password.as_bytes(), &hash) {
        Ok(_) => {
            let salt = SaltString::generate(&mut OsRng);

            let hash = match argon2.hash_password(form.new_password.as_bytes(), &salt) {
                Ok(hash) => hash,
                Err(err) => {
                    log::error!("cloud not convert the password: {}", err);
                    return api_error!("Nie udało się przekonwertować hasła");
                }
            };

            if let Err(err) = repos
                .account
                .change_password(user_id, &hash.to_string())
                .await
            {
                log::error!("could not change the password: {}", err);
                return api_error!("Nie udało się zmienić hasła");
            };
        }
        Err(_) => return api_error!("Podane hasło jest nieprawidłowe"),
    };

    "ok".into_response()
}
