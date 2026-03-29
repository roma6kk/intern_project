-- CreateEnum
CREATE TYPE "ReportPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "assigned_moderator_id" TEXT,
ADD COLUMN     "due_at" TIMESTAMP(3),
ADD COLUMN     "first_response_at" TIMESTAMP(3),
ADD COLUMN     "priority" "ReportPriority" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "sla_notified_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "reports_status_priority_created_at_idx" ON "reports"("status", "priority", "created_at");

-- CreateIndex
CREATE INDEX "reports_assigned_moderator_id_status_idx" ON "reports"("assigned_moderator_id", "status");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_assigned_moderator_id_fkey" FOREIGN KEY ("assigned_moderator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill SLA deadline for open queue
UPDATE "reports"
SET "due_at" = "created_at" + INTERVAL '72 hours'
WHERE "due_at" IS NULL
  AND "status" IN ('OPEN', 'IN_REVIEW');
