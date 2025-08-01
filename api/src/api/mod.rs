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

const FOUR_MB: usize = 1024 * 1024 * 8;

pub struct AppState {
    pub global: Arc<Global>,
}

pub async fn run(global: Arc<Global>) {
    let app_state = Arc::new(AppState {
        global: global.clone(),
    });

    let app = Router::new()
        // authenticated routes (mod, admin)
        .route(
            "/mod/banner_scrap/:file_id",
            get(routes::banner_scrap::handler),
        )
        .route("/mod/accounts", get(routes::account::list::handler))
        .route("/mod/events", get(routes::event::list_moderation::handler))
        .route(
            "/events/:id/update_status",
            put(routes::event::update_status::handler),
        )
        // authenticated routes
        .route("/events", put(routes::event::create::handler))
        .route(
            "/events/:id/update_address",
            patch(routes::event::update_address::handler),
        )
        .route(
            "/account/change_password",
            patch(routes::account::change_password::handler),
        )
        .route("/place_search/:query", get(routes::place_search::handler))
        .route("/file", post(routes::file::upload::handler))
        .layer(axum::middleware::from_fn(middleware::auth::authenticated))
        // public routes
        .route("/health", get(routes::health::handler))
        .route("/events/:id", get(routes::event::details::handler))
        .route("/events/:id/actions", get(routes::event::actions::handler))
        .route("/events/carousel", get(routes::event::carousel::handler))
        .route("/events/search/:query", get(routes::event::search::handler))
        .route("/events", get(routes::event::list::handler))
        .route("/map", get(routes::event::map::handler))
        .route(
            "/events/list_by_state",
            get(routes::event::list_by_state::handler),
        )
        .route("/register", put(routes::register::handler))
        .route("/login", post(routes::login::handler))
        .route("/account/:id", get(routes::account::details::handler))
        .route("/file/:id", get(routes::file::get::handler))
        .route("/contact", post(routes::contact::handler))
        .route("/sitemap_events", get(routes::event::list_sitemap::handler))
        .layer(DefaultBodyLimit::max(FOUR_MB))
        .layer(CorsLayer::permissive())
        .with_state(app_state);

    let port = &global.config().port;
    if let Ok(listener) = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}")).await {
        log::info!("api listening on port {port}");
        if let Err(err) = axum::serve(listener, app).await {
            log::error!("failed to serve the api: {err}");
        }
    }
}
