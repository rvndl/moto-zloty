-- Add migration script here

CREATE TABLE IF NOT EXISTS "action" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  actor_id uuid NOT NULL,
  actor_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ default CURRENT_TIMESTAMP
);
