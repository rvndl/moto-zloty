ALTER TABLE "event" DROP CONSTRAINT IF EXISTS "event_account_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT IF EXISTS "event_full_address_id_address_id_fk";
--> statement-breakpoint
UPDATE "account" SET "rank" = 'user' WHERE "rank" IS NULL;--> statement-breakpoint
UPDATE "account" SET "banned" = false WHERE "banned" IS NULL;--> statement-breakpoint
UPDATE "event" SET "status" = 'pending' WHERE "status" IS NULL;--> statement-breakpoint
UPDATE "file" SET "status" = 'temporary' WHERE "status" IS NULL;--> statement-breakpoint
UPDATE "scraped" SET "seen" = false WHERE "seen" IS NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "rank" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "banned" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "scraped" ALTER COLUMN "seen" SET NOT NULL;--> statement-breakpoint
DELETE FROM "action" WHERE "event_id" NOT IN (SELECT "id" FROM "event");--> statement-breakpoint
DELETE FROM "action" WHERE "actor_id" NOT IN (SELECT "id" FROM "account");--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_actor_id_account_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_full_address_id_address_id_fk" FOREIGN KEY ("full_address_id") REFERENCES "public"."address"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_email_idx" ON "account" USING btree ("email");--> statement-breakpoint
CREATE INDEX "action_event_id_idx" ON "action" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "address_state_idx" ON "address" USING btree ("state");--> statement-breakpoint
CREATE INDEX "event_status_date_from_idx" ON "event" USING btree ("status","date_from");--> statement-breakpoint
CREATE INDEX "event_status_date_to_idx" ON "event" USING btree ("status","date_to");--> statement-breakpoint
CREATE INDEX "event_account_id_idx" ON "event" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "event_full_address_id_idx" ON "event" USING btree ("full_address_id");--> statement-breakpoint
CREATE INDEX "file_status_idx" ON "file" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "scraped_source_url_idx" ON "scraped" USING btree ("source_url");--> statement-breakpoint
CREATE INDEX "scraped_seen_idx" ON "scraped" USING btree ("seen");