use std::sync::Arc;

use axum::{
    routing::{get, post, put},
    Router,
};
use tower_http::cors::CorsLayer;

use crate::global::Global;

pub mod error;
pub mod middleware;
pub mod routes;

pub struct AppState {
    pub global: Arc<Global>,
}

pub async fn run(global: Arc<Global>) {
    let app_state = Arc::new(AppState {
        global: global.clone(),
    });

    let app = Router::new()
        // authenticated routes (mod, admin)
        .route("/mod/events", get(routes::events::list_all))
        .route(
            "/events/:id/update-status",
            put(routes::events::update_status),
        )
        // authenticated routes
        .route("/place_search/:query", get(routes::place_search::search))
        .route("/file", post(routes::file::upload))
        .route("/events", put(routes::events::create))
        .layer(axum::middleware::from_fn(middleware::auth::authenticated))
        // public routes
        .route("/health", get(routes::health::handler))
        .route("/events/:id", get(routes::events::get))
        .route("/events/:id/actions", get(routes::events::actions))
        .route("/events", get(routes::events::list))
        .route("/register", put(routes::register::handler))
        .route("/login", post(routes::login::handler))
        .route("/profile/:id", get(routes::profile::get_profile))
        .route("/file/:id", get(routes::file::get_file))
        .layer(CorsLayer::permissive())
        .with_state(app_state);

    if let Ok(listener) = tokio::net::TcpListener::bind("0.0.0.0:3000").await {
        if let Err(err) = axum::serve(listener, app).await {
            log::error!("failed to serve the api: {}", err);
        }
    }
}
