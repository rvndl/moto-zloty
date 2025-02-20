# Moto-Zloty

Wszystkie zloty motocyklowe w twojej okolicy!

## Directories

```bash
├── api - The API written in Rust
├── web - The web app written in React (Next.js)
```

## Environment Variables

### API

```bash
# PostgreSQL database connection string
DATABASE_URL=""

# Absolute upload path for images
UPLOAD_PATH=""

# Redis connection string
REDIS_URL=""

# LocationIQ API key
LOCATION_IQ_API_KEY=""

# Turnstile secret key
TURNSTILE_SECRET=""

# SMTP login
SMTP_LOGIN=""

# SMTP password
SMTP_PASS=""
```

### Web

```bash
# API URL
NEXT_PUBLIC_API_URL=""

# Public URL
NEXT_PUBLIC_PUBLIC_URL=""

# Site name
NEXT_PUBLIC_SITE_NAME=""

# Turnstile public key
NEXT_PUBLIC_TURNSTILE_KEY=""

# Google adsense publisher ID
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=""

# Cookiebot API key
NEXT_PUBLIC_COOKIEBOT_API_KEY=""

# Google Analytics measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=""

# Privacy policy admin full name
NEXT_PUBLIC_PRIVACY_ADMIN_FULL_NAME=""

# Privacy policy contact email
NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL=""

# Privacy policy site URL
NEXT_PUBLIC_PRIVACY_SITE_URL=""
```

## Installation

Make sure all environment variables are set

### API

The host machine mignt need to have image manipulation libraries installed

The website uses postgres built in full text search, so you need to install the `pg_trgm` extension
Also, you might need to install polish dictionary for PostgreSQL vector search

```bash
cargo run
```

### Web

```bash
yarn
yarn dev
```

## License

[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)
