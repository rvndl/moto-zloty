use sqlx::postgres::PgRow;

#[derive(serde::Deserialize, Debug)]
pub enum SortOrder {
    Asc,
    Desc,
}

impl SortOrder {
    pub fn to_str(&self) -> &str {
        match self {
            SortOrder::Asc => "ASC",
            SortOrder::Desc => "DESC",
        }
    }
}

pub fn has_any_or_error(query: Result<Vec<PgRow>, sqlx::Error>) -> bool {
    match query {
        Ok(rows) => rows.len() > 0,
        Err(_) => false,
    }
}
