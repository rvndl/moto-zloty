const API_URL: &str = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

#[derive(Debug, serde::Deserialize)]
pub struct TurnstileReponse {
    pub success: bool,
}

pub async fn verify(secret: &str, response: &str) -> bool {
    let client = reqwest::Client::new();

    let params = [("secret", secret), ("response", response)];

    let response = match client.post(API_URL).form(&params).send().await {
        Ok(response) => response,
        Err(err) => {
            log::error!("failed to send request to recaptcha: {:?}", err);
            return false;
        }
    };

    match response.json::<TurnstileReponse>().await {
        Ok(result) => result.success,
        Err(err) => {
            log::error!("failed to parse response from recaptcha: {:?}", err);
            false
        }
    }
}
