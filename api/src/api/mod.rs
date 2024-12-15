use std::sync::Arc;

use axum::{
    extract::DefaultBodyLimit,
    routing::{get, patch, post, put},
    Router,
};
use tower_http::cors::CorsLayer;

use crate::global::Global;

pub mod error;
pub mod middleware;
pub mod routes;

const FOUR_MB: usize = 1024 * 1024 * 4;

pub struct AppState {
    pub global: Arc<Global>,
}

pub async fn run(global: Arc<Global>) {
    let app_state = Arc::new(AppState {
        global: global.clone(),
    });

    let app = Router::new()
        // authenticated routes (mod, admin)
        .route("/mod/accounts", get(routes::account::list_all))
        .route("/mod/events", get(routes::event::list_all))
        .route(
            "/events/:id/update-status",
            put(routes::event::update_status),
        )
        // authenticated routes
        .route(
            "/account/change_password",
            patch(routes::account::change_password),
        )
        .route("/place_search/:query", get(routes::place_search::search))
        .route("/file", post(routes::file::upload))
        .route("/events", put(routes::event::create))
        .layer(axum::middleware::from_fn(middleware::auth::authenticated))
        // public routes
        .route("/health", get(routes::health::handler))
        .route("/events/:id", get(routes::event::get))
        .route("/events/:id/actions", get(routes::event::actions))
        .route("/events", get(routes::event::list_public))
        .route("/register", put(routes::register::handler))
        .route("/login", post(routes::login::handler))
        .route("/account/:id", get(routes::account::get))
        .route("/file/:id", get(routes::file::get_file))
        .route("/contact", post(routes::contact::handler))
        .layer(DefaultBodyLimit::max(FOUR_MB))
        .layer(CorsLayer::permissive())
        .with_state(app_state);

    if let Ok(listener) = tokio::net::TcpListener::bind("0.0.0.0:3000").await {
        if let Err(err) = axum::serve(listener, app).await {
            log::error!("failed to serve the api: {}", err);
        }
    }
}
