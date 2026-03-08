use dotenv::dotenv;

use crate::env::Env;

#[derive(Debug)]
pub struct Config {
    pub port: String,
    pub jwt_secret: String,
    pub db_url: String,
    pub redis_url: String,
    pub upload_path: String,
    pub location_iq_api_key: String,
    pub turnstile_secret: String,
    pub smtp_login: String,
    pub smtp_pass: String,
}

impl Config {
    pub fn new() -> Self {
        if let Err(err) = dotenv() {
            log::error!("failed to parse .env file: {}, exiting ...", err);
            std::process::exit(0);
        };

        let port = Env::new("PORT", true, |val| val).get();
        let jwt_secret = Env::new("JWT_SECRET", true, |val| val).get();
        let db_url = Env::new("DATABASE_URL", true, |val| val).get();
        let redis_url = Env::new("REDIS_URL", true, |val| val).get();
        let upload_path = Env::new("UPLOAD_PATH", true, |val| val).get();
        let location_iq_api_key = Env::new("LOCATION_IQ_API_KEY", true, |val| val).get();
        let turnstile_secret = Env::new("TURNSTILE_SECRET", true, |val| val).get();
        let smtp_login = Env::new("SMTP_LOGIN", true, |val| val).get();
        let smtp_pass = Env::new("SMTP_PASS", true, |val| val).get();

        Config {
            port,
            jwt_secret,
            db_url,
            redis_url,
            upload_path,
            location_iq_api_key,
            turnstile_secret,
            smtp_login,
            smtp_pass,
        }
    }
}
