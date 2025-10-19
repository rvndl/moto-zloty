-- Add migration script here
CREATE INDEX event_trgm_idx ON "event" USING GIN (name gin_trgm_ops);
CREATE INDEX event_address_trgm_idx ON "event" USING GIN (address gin_trgm_ops);