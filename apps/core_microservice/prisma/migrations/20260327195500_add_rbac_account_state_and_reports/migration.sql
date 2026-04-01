-- Create enums
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');
CREATE TYPE "AccountState" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'REJECTED');
CREATE TYPE "ModerationAction" AS ENUM ('NONE', 'HIDE', 'DELETE', 'WARN');

-- Alter accounts with role/state model
ALTER TABLE "accounts"
ADD COLUMN "role" "PlatformRole" NOT NULL DEFAULT 'USER',
ADD COLUMN "state" "AccountState" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "state_changed_at" TIMESTAMP(3),
ADD COLUMN "state_changed_by" TEXT,
ADD COLUMN "state_reason" TEXT,
ADD COLUMN "deletion_requested_at" TIMESTAMP(3),
ADD COLUMN "recovery_deadline" TIMESTAMP(3);

-- Backfill state from existing soft-delete
UPDATE "accounts" a
SET
  "state" = 'DELETED',
  "deletion_requested_at" = u."deleted_at",
  "recovery_deadline" = (u."deleted_at" + INTERVAL '30 day'),
  "state_changed_at" = u."deleted_at"
FROM "users" u
WHERE a."user_id" = u."id"
  AND u."deleted_at" IS NOT NULL;

-- Add moderation visibility flags to content
ALTER TABLE "posts"
ADD COLUMN "is_hidden" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "comments"
ADD COLUMN "is_hidden" BOOLEAN NOT NULL DEFAULT false;

-- Reports table
CREATE TABLE "reports" (
  "id" TEXT NOT NULL,
  "reporter_id" TEXT NOT NULL,
  "post_id" TEXT,
  "comment_id" TEXT,
  "reason" TEXT NOT NULL,
  "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
  "action" "ModerationAction" NOT NULL DEFAULT 'NONE',
  "resolution_note" TEXT,
  "resolved_by_id" TEXT,
  "resolved_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3),
  CONSTRAINT "reports_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reports_post_or_comment_check" CHECK (
    (CASE WHEN "post_id" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN "comment_id" IS NULL THEN 0 ELSE 1 END) = 1
  )
);

CREATE INDEX "reports_reporter_id_created_at_idx" ON "reports"("reporter_id", "created_at");
CREATE INDEX "reports_status_created_at_idx" ON "reports"("status", "created_at");
CREATE INDEX "reports_post_id_idx" ON "reports"("post_id");
CREATE INDEX "reports_comment_id_idx" ON "reports"("comment_id");

ALTER TABLE "reports"
ADD CONSTRAINT "reports_reporter_id_fkey"
FOREIGN KEY ("reporter_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reports"
ADD CONSTRAINT "reports_post_id_fkey"
FOREIGN KEY ("post_id") REFERENCES "posts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reports"
ADD CONSTRAINT "reports_comment_id_fkey"
FOREIGN KEY ("comment_id") REFERENCES "comments"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reports"
ADD CONSTRAINT "reports_resolved_by_id_fkey"
FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
