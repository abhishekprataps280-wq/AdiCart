CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"line1" text DEFAULT '' NOT NULL,
	"line2" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"state" text DEFAULT '' NOT NULL,
	"pin" text DEFAULT '' NOT NULL,
	"country" text DEFAULT 'India' NOT NULL,
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" text PRIMARY KEY,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pin" text NOT NULL,
	"courier" text NOT NULL,
	"delivery_days" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"customer" jsonb DEFAULT '{}' NOT NULL,
	"address" jsonb DEFAULT '{}' NOT NULL,
	"payment_method" text DEFAULT 'COD' NOT NULL,
	"total" integer NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"shipping" jsonb DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'placed' NOT NULL,
	"shipment_events" jsonb DEFAULT '[]' NOT NULL,
	"placed_at" timestamp DEFAULT now(),
	"estimated_delivery" timestamp,
	"updated_at" timestamp,
	"shipped_at" timestamp,
	"delivered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY,
	"order_id" integer NOT NULL,
	"method" text NOT NULL,
	"amount" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"details" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"name_hi" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'electronics' NOT NULL,
	"price" integer NOT NULL,
	"original" integer NOT NULL,
	"rating" numeric(3,1) DEFAULT '4.0' NOT NULL,
	"reviews" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"badge" text DEFAULT 'new' NOT NULL,
	"emoji" text DEFAULT '📦' NOT NULL,
	"stock" integer DEFAULT 100 NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"images" jsonb DEFAULT '[]' NOT NULL,
	"seller" text DEFAULT '' NOT NULL,
	"seller_location" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"phone" text DEFAULT '' NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");