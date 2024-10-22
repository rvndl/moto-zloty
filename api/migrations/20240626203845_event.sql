-- -- Add migration script here

DROP TYPE IF EXISTS EVENT_STATUS;
CREATE TYPE EVENT_STATUS as ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS "event" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  status EVENT_STATUS NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  dateFrom TIMESTAMP NOT NULL,
  dateTo TIMESTAMP,
  banner TEXT,
  created_at TIMESTAMP default CURRENT_TIMESTAMP,
  account_id INTEGER NOT NULL
);

ALTER SEQUENCE event_id_seq RESTART WITH 1;
