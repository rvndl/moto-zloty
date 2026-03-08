use core::fmt;
use std::borrow::Cow;

use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

#[macro_export]
macro_rules! api_error {
    ($($arg:tt)*) => {{
        crate::api::error::ApiError::new(format!($($arg)*)).into()
    }};
}

#[macro_export]
macro_rules! api_error_log {
    ($($arg:tt)*) => {{
        log::error!($($arg)*);
        crate::api::error::ApiError::new(format!($($arg)*)).into()
    }};
}

#[derive(Debug, serde::Serialize)]
pub struct ApiError<'a> {
    message: Cow<'a, str>,
}

impl<'a> ApiError<'a> {
    pub fn new<S>(message: S) -> Self
    where
        S: Into<Cow<'a, str>>,
    {
        ApiError {
            message: message.into(),
        }
    }
}

impl<'a> Into<Response> for ApiError<'a> {
    fn into(self) -> Response {
        let mut response = Json(&self).into_response();
        *response.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;

        response
    }
}

impl<'a> IntoResponse for ApiError<'a> {
    fn into_response(self) -> Response {
        self.into()
    }
}

impl<'a> fmt::Display for ApiError<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}
