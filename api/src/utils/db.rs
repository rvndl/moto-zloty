use sqlx::postgres::PgRow;

pub fn has_any_or_error(query: Result<Vec<PgRow>, sqlx::Error>) -> bool {
    match query {
        Ok(rows) => rows.len() > 0,
        Err(_) => false,
    }
}
