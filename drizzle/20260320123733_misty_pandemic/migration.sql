CREATE TYPE "task_category" AS ENUM('DUE_DILIGENCE', 'LEGAL', 'VALORACION', 'NEGOCIACION', 'CATASTRO', 'SUBASTA', 'ADMINISTRATIVO', 'OTRO');--> statement-breakpoint
CREATE TYPE "task_priority" AS ENUM('ALTA', 'MEDIA', 'BAJA');--> statement-breakpoint
CREATE TYPE "task_status" AS ENUM('PENDIENTE', 'EN_CURSO', 'COMPLETADA', 'BLOQUEADA', 'CANCELADA');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"expediente" varchar(100) NOT NULL,
	"community_id" uuid NOT NULL,
	"status" "task_status" DEFAULT 'PENDIENTE'::"task_status" NOT NULL,
	"priority" "task_priority" DEFAULT 'MEDIA'::"task_priority" NOT NULL,
	"category" "task_category" DEFAULT 'OTRO'::"task_category" NOT NULL,
	"attachments" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"creator_id" text NOT NULL,
	"assignee_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_community_id_communities_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creator_id_users_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_users_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE CASCADE;