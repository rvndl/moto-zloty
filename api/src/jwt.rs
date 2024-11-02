use std::borrow::Cow;

use crate::db::models::account::AccountRank;

const JWT_SECRET: &'static str = "secret";

#[derive(serde::Serialize, Debug)]
pub struct JwtClaims {
    username: String,
    rank: AccountRank,
}

pub fn sign<'a, U, R>(username: U, rank: R) -> Result<String, jsonwebtoken::errors::Error>
where
    U: Into<Cow<'a, str>>,
    R: Into<Cow<'a, AccountRank>>,
{
    let claims = JwtClaims {
        username: username.into().into_owned(),
        rank: rank.into().into_owned(),
    };

    jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &jsonwebtoken::EncodingKey::from_secret(JWT_SECRET.as_ref()),
    )
}
