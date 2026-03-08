use std::sync::Arc;

use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Form,
};
use lettre::{
    message::header::ContentType, transport::smtp::authentication::Credentials, Message,
    SmtpTransport, Transport,
};

use crate::{
    api::AppState,
    api_error, turnstile,
    validation::{RangeBoundary, RangeValidation, RangeValidationStatus},
};

const NAME_LENGTH_BOUNDARIES: RangeBoundary = (3, 32);
const CONTENT_LENGTH_BOUNDARIES: RangeBoundary = (3, 1024);

#[derive(serde::Deserialize, Debug)]
pub struct ContactForm {
    name: String,
    email: String,
    content: String,
    recaptcha: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Form(form): Form<ContactForm>,
) -> Response {
    match form.name.in_range(NAME_LENGTH_BOUNDARIES) {
        RangeValidationStatus::TooLong => return api_error!("Podana nazwa jest zbyt długa"),
        RangeValidationStatus::TooShort => return api_error!("Podana nazwa jest zbyt krótka"),
        _ => (),
    }

    match form.content.in_range(CONTENT_LENGTH_BOUNDARIES) {
        RangeValidationStatus::TooLong => return api_error!("Treść jest zbyt długa"),
        RangeValidationStatus::TooShort => return api_error!("Treść jest zbyt krótka"),
        _ => (),
    }

    let config = state.global.config();
    if !turnstile::verify(&config.turnstile_secret, &form.recaptcha).await {
        return api_error!("Weryfikacja Turnstile nie powiodła się");
    }

    let email = Message::builder()
        .from(format!("{} <{}>", form.name, form.email).parse().unwrap())
        .to(config.smtp_login.parse().unwrap())
        .subject("Moto-Zloty - Kontakt")
        .header(ContentType::TEXT_PLAIN)
        .body(format!(
            "Od: \n{} ({})\n\nTreść: \n{}",
            form.name, form.email, form.content
        ))
        .expect("failed to generate email");

    let creds = Credentials::new(config.smtp_login.clone(), config.smtp_pass.clone());
    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => "ok".into_response(),
        Err(err) => {
            log::error!("failed to send email: {}", err);
            api_error!("Wystąpił błąd podczas wysyłania wiadomości")
        }
    }
}
