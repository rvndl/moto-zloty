use axum::{extract::Request, http::StatusCode, middleware::Next, response::IntoResponse};

use crate::{env::Env, jwt};

pub async fn authenticated(mut req: Request, next: Next) -> impl IntoResponse {
    let auth_header = req.headers().get("Authorization");
    if auth_header.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }

    let auth_header = match auth_header {
        Some(header) => header.to_str().unwrap(),
        None => return StatusCode::UNAUTHORIZED.into_response(),
    };

    let mut header = auth_header.split_whitespace();
    let (_, token) = (header.next(), header.next());

    match token {
        Some(token) => {
            let jwt_secret = Env::new("JWT_SECRET", true, |val| val).get();
            let claims = match jwt::decode(&jwt_secret, token) {
                Ok(token_data) => token_data.claims,
                Err(_) => return StatusCode::UNAUTHORIZED.into_response(),
            };

            req.extensions_mut().insert(claims);
            next.run(req).await
        }
        None => StatusCode::UNAUTHORIZED.into_response(),
    }
}
