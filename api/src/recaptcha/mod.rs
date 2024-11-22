use reqwest::Url;

const API_URL: &str = "https://www.google.com/recaptcha/api/siteverify";

#[derive(Debug, serde::Deserialize)]
pub struct ReCaptchaReponse {
    pub success: bool,
}

pub async fn verify(secret: &str, response: &str) -> bool {
    let mut url = Url::parse(API_URL).unwrap();
    url.query_pairs_mut()
        .append_pair("secret", secret)
        .append_pair("response", response);

    let response = match reqwest::get(url).await {
        Ok(response) => response,
        Err(err) => {
            log::error!("failed to send request to recaptcha: {:?}", err);
            return false;
        }
    };

    match response.json::<ReCaptchaReponse>().await {
        Ok(result) => result.success,
        Err(err) => {
            log::error!("failed to parse response from recaptcha: {:?}", err);
            false
        }
    }
}
