const TURNSTILE_API_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = Bun.env.TURNSTILE_SECRET;

  if (!secret) {
    console.warn("TURNSTILE_SECRET not set - skipping verification");
    return true;
  }

  try {
    const response = await fetch(TURNSTILE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const result = (await response.json()) as TurnstileResponse;
    return result.success;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}
