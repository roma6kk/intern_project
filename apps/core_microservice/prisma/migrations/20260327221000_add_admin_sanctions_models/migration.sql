-- Alter accounts for sanctions
ALTER TABLE "accounts"
ADD COLUMN "suspended_until" TIMESTAMP(3),
ADD COLUMN "escalation_level" INTEGER NOT NULL DEFAULT 0;

-- Create enums
CREATE TYPE "WarningSource" AS ENUM ('MANUAL', 'REPORT');
CREATE TYPE "SanctionType" AS ENUM ('SUSPEND');
CREATE TYPE "ModerationLogAction" AS ENUM ('ROLE_CHANGED', 'WARNING_ISSUED', 'SUSPENDED', 'UNSUSPENDED', 'ESCALATED');

-- Create user_warnings
CREATE TABLE "user_warnings" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "actor_id" TEXT NOT NULL,
  "report_id" TEXT,
  "reason" TEXT NOT NULL,
  "source" "WarningSource" NOT NULL DEFAULT 'MANUAL',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_warnings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_warnings_user_id_created_at_idx" ON "user_warnings"("user_id", "created_at");
CREATE INDEX "user_warnings_actor_id_created_at_idx" ON "user_warnings"("actor_id", "created_at");

ALTER TABLE "user_warnings"
ADD CONSTRAINT "user_warnings_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_warnings"
ADD CONSTRAINT "user_warnings_actor_id_fkey"
FOREIGN KEY ("actor_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_warnings"
ADD CONSTRAINT "user_warnings_report_id_fkey"
FOREIGN KEY ("report_id") REFERENCES "reports"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Create user_sanctions
CREATE TABLE "user_sanctions" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "actor_id" TEXT NOT NULL,
  "report_id" TEXT,
  "type" "SanctionType" NOT NULL,
  "reason" TEXT NOT NULL,
  "until" TIMESTAMP(3),
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revoked_at" TIMESTAMP(3),
  CONSTRAINT "user_sanctions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_sanctions_user_id_is_active_created_at_idx" ON "user_sanctions"("user_id", "is_active", "created_at");
CREATE INDEX "user_sanctions_actor_id_created_at_idx" ON "user_sanctions"("actor_id", "created_at");

ALTER TABLE "user_sanctions"
ADD CONSTRAINT "user_sanctions_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_sanctions"
ADD CONSTRAINT "user_sanctions_actor_id_fkey"
FOREIGN KEY ("actor_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_sanctions"
ADD CONSTRAINT "user_sanctions_report_id_fkey"
FOREIGN KEY ("report_id") REFERENCES "reports"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Create moderation_logs
CREATE TABLE "moderation_logs" (
  "id" TEXT NOT NULL,
  "actor_id" TEXT NOT NULL,
  "target_user_id" TEXT NOT NULL,
  "action_type" "ModerationLogAction" NOT NULL,
  "reason" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "moderation_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "moderation_logs_target_user_id_created_at_idx" ON "moderation_logs"("target_user_id", "created_at");
CREATE INDEX "moderation_logs_actor_id_created_at_idx" ON "moderation_logs"("actor_id", "created_at");

ALTER TABLE "moderation_logs"
ADD CONSTRAINT "moderation_logs_actor_id_fkey"
FOREIGN KEY ("actor_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "moderation_logs"
ADD CONSTRAINT "moderation_logs_target_user_id_fkey"
FOREIGN KEY ("target_user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
