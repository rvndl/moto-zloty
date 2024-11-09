-- Add migration script here

DROP TYPE IF EXISTS FILE_STATUS;
CREATE TYPE FILE_STATUS as ENUM ('temporary', 'permanent');

CREATE TABLE IF NOT EXISTS "file" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  status FILE_STATUS default 'temporary',
  created_at TIMESTAMPTZ default CURRENT_TIMESTAMP
);
