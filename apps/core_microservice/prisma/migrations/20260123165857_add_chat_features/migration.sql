-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('PRIVATE', 'GROUP');

-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "message_id" TEXT;

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "name" TEXT,
ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "is_edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "content" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
