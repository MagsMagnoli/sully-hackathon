ALTER TABLE "conversations" RENAME COLUMN "conversationStatus" TO "conversation_status";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "conversationId" TO "conversation_id";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "translatedText" TO "translated_text";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "translatedLanguage" TO "translated_language";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_conversations_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
