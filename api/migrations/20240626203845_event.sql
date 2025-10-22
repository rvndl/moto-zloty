-- -- Add migration script here
DROP TYPE IF EXISTS EVENT_STATUS;
CREATE TYPE EVENT_STATUS as ENUM ('pending', 'approved', 'rejected');
CREATE TABLE IF NOT EXISTS "event" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  status EVENT_STATUS default 'pending',
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  date_from TIMESTAMPTZ NOT NULL,
  date_to TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ default CURRENT_TIMESTAMP,
  banner_id uuid,
  account_id uuid NOT NULL REFERENCES account (id)
);