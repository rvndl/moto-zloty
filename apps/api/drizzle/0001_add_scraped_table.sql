CREATE TABLE "scraped" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"image_url" text,
	"description" text,
	"place" text,
	"seen" boolean DEFAULT false,
	"source_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
