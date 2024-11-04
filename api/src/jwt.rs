use std::borrow::Cow;

use jsonwebtoken::TokenData;

use crate::db::models::account::AccountRank;

const JWT_SECRET: &'static str = "secret";

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
pub struct JwtClaims {
    pub id: i32,
    pub username: String,
    pub rank: AccountRank,
    exp: i64,
}

pub fn sign<'a, U, R>(id: i32, username: U, rank: R) -> Result<String, jsonwebtoken::errors::Error>
where
    U: Into<Cow<'a, str>>,
    R: Into<Cow<'a, AccountRank>>,
{
    let one_week = chrono::Duration::weeks(1);
    let exp = (chrono::Utc::now() + one_week).timestamp();

    let claims = JwtClaims {
        id,
        username: username.into().into_owned(),
        rank: rank.into().into_owned(),
        exp,
    };

    let header = jsonwebtoken::Header::default();
    let encoding_key = jsonwebtoken::EncodingKey::from_secret(JWT_SECRET.as_ref());

    jsonwebtoken::encode(&header, &claims, &encoding_key)
}

pub fn decode(token: &str) -> Result<TokenData<JwtClaims>, jsonwebtoken::errors::Error> {
    let decoding_key = jsonwebtoken::DecodingKey::from_secret(JWT_SECRET.as_ref());
    let validation = jsonwebtoken::Validation::default();

    jsonwebtoken::decode::<JwtClaims>(token, &decoding_key, &validation)
}
