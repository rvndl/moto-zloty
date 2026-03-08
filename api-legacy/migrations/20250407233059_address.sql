-- Add migration script here
CREATE TABLE IF NOT EXISTS address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  house_number TEXT,
  road TEXT,
  neighbourhood TEXT,
  suburb TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ default CURRENT_TIMESTAMP
);
ALTER TABLE event
ALTER COLUMN address DROP NOT NULL;
ALTER TABLE event
ADD COLUMN full_address_id uuid REFERENCES address (id);