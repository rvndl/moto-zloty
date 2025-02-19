-- Add migration script here
ALTER TABLE "event"
ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('polish', name || ' ' || coalesce(address, ''))
  ) STORED;
CREATE INDEX event_search_idx ON "event" USING GIN (search_vector);