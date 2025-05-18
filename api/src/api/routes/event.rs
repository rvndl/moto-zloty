use std::sync::Arc;

use crate::api::AppState;
use crate::db::models::event::EventStatus;
use crate::db::models::file::FileStatus;
use crate::jwt::JwtClaims;
use crate::place_search::LocationIQAddress;
use crate::repos::event::JoinEventFlags;
use crate::utils::account::is_permitted;
use crate::utils::db::SortOrder;
use crate::{api_error, api_error_log};
use axum::extract::{Path, Query};
use axum::response::IntoResponse;
use axum::{extract::State, response::Response, Json};
use axum::{Extension, Form};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct AliasedLocationIQAddress {
    #[serde(rename = "address[name]")]
    pub name: Option<String>,

    #[serde(rename = "address[house_number]")]
    pub house_number: Option<String>,

    #[serde(rename = "address[road]")]
    pub road: Option<String>,

    #[serde(rename = "address[neighbourhood]")]
    pub neighbourhood: Option<String>,

    #[serde(rename = "address[suburb]")]
    pub suburb: Option<String>,

    #[serde(rename = "address[city]")]
    pub city: Option<String>,

    #[serde(rename = "address[state]")]
    pub state: Option<String>,
}

impl Into<LocationIQAddress> for AliasedLocationIQAddress {
    fn into(self) -> LocationIQAddress {
        LocationIQAddress {
            name: self.name,
            house_number: self.house_number,
            road: self.road,
            neighbourhood: self.neighbourhood,
            suburb: self.suburb,
            city: self.city,
            state: self.state,
        }
    }
}

#[derive(serde::Deserialize, Debug, Clone)]
pub struct UpdateAddressForm {
    #[serde(flatten)]
    pub address: AliasedLocationIQAddress,

    pub lat: f64,
    pub lon: f64,
}

#[derive(serde::Deserialize, Debug)]
pub struct CreateForm {
    name: String,
    description: Option<String>,

    #[serde(flatten)]
    address: Option<AliasedLocationIQAddress>,
    lat: f64,
    lon: f64,
    date_from: String,
    date_to: String,
    banner_id: Option<Uuid>,
    banner_small_id: Option<Uuid>,
}

#[derive(serde::Deserialize, Debug)]
pub struct UpdateStatusForm {
    status: EventStatus,
}

#[derive(serde::Deserialize, Debug)]
pub struct PublicListFilters {
    date_from: Option<DateTime<Utc>>,
    date_to: Option<DateTime<Utc>>,
    sort_order: Option<SortOrder>,
}

pub async fn details(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    let event = repos
        .event
        .fetch_by_id_joined(
            id,
            JoinEventFlags::Account | JoinEventFlags::Address | JoinEventFlags::AccountTypePublic,
        )
        .await;

    let event = match event {
        Ok(event) => event,
        Err(err) => return api_error_log!("failed to fetch event: {}", err),
    };

    Json(event).into_response()
}

pub async fn create(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
    Form(form): Form<CreateForm>,
) -> Response {
    let user_id = claims.id;
    let repos = state.global.repos();

    let address = repos.address.create(form.address.unwrap().into()).await;
    let address = match address {
        Ok(address) => address,
        Err(err) => {
            log::error!("failed to create address: {}", err);
            return api_error!("Wystąpił błąd podczas tworzenia adresu, spróbuj ponownie");
        }
    };

    let date_from: DateTime<Utc> = form
        .date_from
        .parse::<DateTime<Utc>>()
        .expect("failed to parse the field date_from")
        .to_utc();

    let date_to = form
        .date_to
        .parse::<DateTime<Utc>>()
        .expect("failed to parse the field date_to")
        .to_utc();

    let event = match repos
        .event
        .create(
            &form.name,
            form.description,
            None,
            address.id,
            form.lat,
            form.lon,
            date_from,
            date_to,
            form.banner_id,
            form.banner_small_id,
            user_id,
        )
        .await
    {
        Ok(event) => event,
        Err(err) => return api_error_log!("failed to create event: {}", err),
    };

    if let Some(banner_id) = event.banner_id {
        if let Err(err) = repos
            .file
            .change_status(banner_id, FileStatus::PERMANENT)
            .await
        {
            return api_error_log!("failed to change file status: {}", err);
        }
    };

    if let Some(banner_small_id) = event.banner_small_id {
        if let Err(err) = repos
            .file
            .change_status(banner_small_id, FileStatus::PERMANENT)
            .await
        {
            return api_error_log!("failed to change file status: {}", err);
        }
    };

    if let Err(err) = repos
        .action
        .create(
            event.id,
            user_id,
            &claims.username,
            &EventStatus::PENDING.get_action_name(),
        )
        .await
    {
        return api_error_log!("failed to create action: {}", err);
    };

    Json(event).into_response()
}

pub async fn carousel(State(state): State<Arc<AppState>>) -> Response {
    let repos = state.global.repos();

    let events = repos.event.fetch_all_carousel().await;
    let events = match events {
        Ok(events) => events,
        Err(err) => {
            log::error!("failed to fetch carousel events: {}", err);
            return api_error!("Wystąpił błąd podczas pobierania wydarzeń karuzeli");
        }
    };

    Json(events).into_response()
}

pub async fn list_public(
    State(state): State<Arc<AppState>>,
    Query(filters): Query<PublicListFilters>,
) -> Response {
    let repos = state.global.repos();

    let PublicListFilters {
        date_from,
        date_to,
        sort_order,
    } = filters;

    let sort_order = sort_order.unwrap_or(SortOrder::Desc);

    let events = repos
        .event
        .fetch_all_joined(
            JoinEventFlags::Account | JoinEventFlags::AccountTypePublic | JoinEventFlags::Address,
            EventStatus::APPROVED,
            date_from,
            date_to,
            sort_order,
        )
        .await;

    let events = match events {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to fetch approved events: {}", err),
    };

    Json(events).into_response()
}

pub async fn list_all(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
) -> Response {
    if !is_permitted(claims.rank) {
        return api_error!("Brak uprawnień");
    }

    let repos = state.global.repos();

    let events = repos.event.fetch_all().await;
    let events = match events {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to fetch approved events: {}", err),
    };

    Json(events).into_response()
}

pub async fn update_status(
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

pub async fn actions(State(state): State<Arc<AppState>>, Path(id): Path<Uuid>) -> Response {
    let repos = state.global.repos();

    let actions = repos.action.fetch_all_by_event_id(id).await;
    let actions = match actions {
        Ok(actions) => actions,
        Err(err) => return api_error_log!("failed to fetch actions: {}", err),
    };

    Json(actions).into_response()
}

pub async fn search(State(state): State<Arc<AppState>>, Path(query): Path<String>) -> Response {
    let repos = state.global.repos();

    let events = repos.event.search(&query).await;
    let events = match events {
        Ok(events) => events,
        Err(err) => return api_error_log!("failed to search events: {}", err),
    };

    Json(events).into_response()
}

pub async fn update_address(
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
