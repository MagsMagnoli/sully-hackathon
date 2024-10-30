CREATE TYPE "public"."speakers" AS ENUM('doctor', 'patient');--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "speaker" "speakers" NOT NULL;