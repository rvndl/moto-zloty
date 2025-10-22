use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Extension, Form, Json,
};
use uuid::Uuid;

use crate::{
    api::AppState, api_error, api_error_log, jwt::JwtClaims, utils::account::is_permitted,
};

use super::AliasedLocationIQAddress;

#[derive(serde::Deserialize, Debug, Clone)]
pub struct UpdateAddressForm {
    #[serde(flatten)]
    pub address: AliasedLocationIQAddress,

    pub lat: f64,
    pub lon: f64,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    Extension(claims): Extension<JwtClaims>,
    Form(form): Form<UpdateAddressForm>,
) -> Response {
    let repos = state.global.repos();

    let event = repos.event.fetch_by_id(id).await;
    let event = match event {
        Ok(event) => event,
        Err(err) => {
            log::error!("failed to fetch event: {}", err);
            return api_error!("Wystąpił błąd podczas pobierania wydarzenia");
        }
    };

    if is_permitted(claims.rank) || event.account_id.eq(&claims.id) {
        let address = match event.full_address_id {
            // update current address model if it exists
            Some(full_address_id) => {
                let address = repos
                    .address
                    .update(full_address_id, form.clone().address.into())
                    .await;

                let address = match address {
                    Ok(address) => address,
                    Err(err) => return api_error_log!("failed to update address: {}", err),
                };

                address
            }
            // migrate old string based address to the new address model
            None => {
                let address = repos.address.create(form.clone().address.into()).await;
                let address = match address {
                    Ok(address) => address,
                    Err(err) => {
                        log::error!("failed to create address: {}", err);
                        return api_error!(
                            "Wystąpił błąd podczas tworzenia adresu, spróbuj ponownie"
                        );
                    }
                };

                let event = repos.event.update_full_address_id(id, address.id).await;
                if let Err(err) = event {
                    log::error!("failed to update event address: {}", err);
                    return api_error!("Wystąpił błąd podczas tworzenia adresu, spróbuj ponownie");
                }

                address
            }
        };

        if let Err(err) = repos.event.update_lat_lang(id, form.lat, form.lon).await {
            log::error!("failed to update event lat lang: {}", err);
            return api_error!(
                "Wystąpił błąd podczas aktualizacji współrzędnych, spróbuj ponownie"
            );
        };

        let action = repos
            .action
            .create(id, claims.id, &claims.username, "Aktualizacja adresu")
            .await;

        // we don't want to fail the request if we can't create an action
        if let Err(err) = action {
            log::error!("failed to create change address action: {}", err);
        }

        Json(address).into_response()
    } else {
        api_error!("Brak uprawnień")
    }
}
