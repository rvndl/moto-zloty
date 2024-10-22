use crate::db::models::account::AccountRank;

const JWT_SECRET: &'static str = "secret";

#[derive(serde::Serialize, Debug)]
pub struct JwtClaims {
    username: String,
    rank: AccountRank,
}

pub fn sign(username: String, rank: AccountRank) -> Result<String, jsonwebtoken::errors::Error> {
    let claims = JwtClaims { username, rank };

    jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &jsonwebtoken::EncodingKey::from_secret(JWT_SECRET.as_ref()),
    )
}
