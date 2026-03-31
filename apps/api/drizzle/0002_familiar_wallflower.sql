ALTER TABLE "event" DROP CONSTRAINT "event_account_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_full_address_id_address_id_fk";
--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_actor_id_account_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_banner_id_file_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."file"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_banner_small_id_file_id_fk" FOREIGN KEY ("banner_small_id") REFERENCES "public"."file"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_full_address_id_address_id_fk" FOREIGN KEY ("full_address_id") REFERENCES "public"."address"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_banned_idx" ON "account" USING btree ("banned");--> statement-breakpoint
CREATE INDEX "action_event_id_idx" ON "action" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "action_actor_id_idx" ON "action" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "event_account_id_idx" ON "event" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "event_status_idx" ON "event" USING btree ("status");--> statement-breakpoint
CREATE INDEX "event_dates_idx" ON "event" USING btree ("date_from","date_to");--> statement-breakpoint
CREATE INDEX "file_status_idx" ON "file" USING btree ("status");--> statement-breakpoint
CREATE INDEX "scraped_seen_idx" ON "scraped" USING btree ("seen");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "scraped" ADD CONSTRAINT "scraped_source_url_unique" UNIQUE("source_url");