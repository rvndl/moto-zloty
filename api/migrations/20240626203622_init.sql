-- Add migration script here
DROP TYPE IF EXISTS ACCOUNT_RANK;
CREATE TYPE ACCOUNT_RANK as ENUM ('admin', 'user');

CREATE TABLE IF NOT EXISTS "account" (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  rank ACCOUNT_RANK default 'user',
  banned BOOLEAN default FALSE,
  ban_reason TEXT,
  banned_at TIMESTAMP,
  created_at TIMESTAMP default CURRENT_TIMESTAMP,
  UNIQUE(username)
);

ALTER SEQUENCE account_id_seq RESTART WITH 1;
