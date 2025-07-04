use std::{fs::File, io::Read, path::Path, sync::Arc, time::Duration};

use axum::{
    extract::{self, State},
    http::{header, StatusCode},
    response::{IntoResponse, Response},
    Extension,
};
use gem_rs::{
    api::Models,
    client::GemSession,
    types::{Context, FileManager, Role, Settings},
};
use uuid::Uuid;

use crate::{api::AppState, api_error, jwt::JwtClaims, utils::account::is_permitted};

const PROMPT: &str = "
    Extract the following information from the image:
        - name
        - description: preserve original formatting and capitalization. Do not use all uppercase, should be nicely capitalized, make sure it's nicely formatted, use dashes, bullet points, etc. Make the description SEO friendly. Use markdown formatting!
        - date_from: formatted as ISO 8601 datetime. If the description contains time, include it in the datetime.
        - date_to: formatted as ISO 8601 datetime. Include the time if mentioned in the description.
        - location: more precise location can also be included in description, look for it.

    Additional instructions:
        Keep the original language. Do not translate.
        Do not add any extra information.
        Return only the extracted data in raw JSON format with the keys: name, date_from, date_to, description, location.
        Ensure the JSON is valid and properly formatted.
        Do not wrap the output in a code block or text block—just return the raw JSON.
        Remove \"Pokaż mniej\" or \"Pokaż więcej\" from the description if present.
        Make the description nicely readable and formatted, but do not change the original meaning, it should be capitalized, NOT uppercase, separate the text using new lines, add dashes, bullet points, etc., make it SEO friendly.
        If the starting date doesn't contain a time, assume it starts at 00:00:00.
        If the ending date doesn't contain a time, assume it ends at 23:59:59.
        The description should be POLISH only!
";

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<JwtClaims>,
    extract::Path(file_id): extract::Path<Uuid>,
) -> Response {
    if !is_permitted(claims.rank) {
        return api_error!("Brak uprawnień.");
    }

    let repos = state.global.repos();

    let banner = repos.file.fetch_one(file_id).await;
    let banner = match banner {
        Ok(banner) => banner,
        Err(err) => {
            log::error!("failed to fetch banner: {}", err);
            return api_error!(
                "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie."
            );
        }
    };

    let mut session = GemSession::Builder()
        .connect_timeout(Duration::from_secs(30))
        .timeout(Some(Duration::from_secs(30)))
        .model(Models::Custom("gemini-2.5-flash-preview-05-20".into()))
        .context(Context::new())
        .build();

    let mut settings = Settings::new();
    settings.set_all_safety_settings(gem_rs::types::HarmBlockThreshold::BlockNone);
    settings.set_system_instruction(PROMPT);

    let mut file_manager = FileManager::new();
    file_manager.fetch_list().await.unwrap();

    let banner_path = Path::new(&banner.path);
    if !banner_path.exists() {
        return api_error!(
            "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie."
        );
    }

    let mut banner_file = match File::open(banner_path) {
        Ok(file) => file,
        Err(err) => {
            log::error!("failed to open banner file: {}", err);
            return api_error!(
                "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie."
            );
        }
    };

    let mut buff = Vec::new();
    if let Err(err) = banner_file.read_to_end(&mut buff) {
        log::error!("failed to read banner file: {}", err);
        return api_error!(
            "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie."
        );
    }

    let banner_data = match file_manager
        .add_file_from_bytes("banner", buff, "image/webp")
        .await
    {
        Ok(data) => data,
        Err(err) => {
            log::error!("failed to add banner file: {}", err);
            return api_error!(
                "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie."
            );
        }
    };

    let results = match session.send_file(banner_data, Role::User, &settings).await {
        Ok(response) => response.get_results(),
        Err(err) => {
            log::error!("failed to send banner file: {}", err);
            return api_error!(
                "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie."
            );
        }
    };

    let result = match results.first() {
        Some(result) => result,
        None => {
            log::error!("failed to get banner results");
            return api_error!(
                "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie."
            );
        }
    };

    let cleanded_result = result.replace("json", "").replace("`", "");

    (
        StatusCode::OK,
        [(header::CONTENT_TYPE, "application/json")],
        cleanded_result,
    )
        .into_response()
}
