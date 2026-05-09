-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "chat_participants" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "chats" ADD COLUMN "description" TEXT;

-- Migrate data from _ChatToUser to chat_participants (creator -> ADMIN, others -> MEMBER)
INSERT INTO "chat_participants" ("id", "chat_id", "user_id", "role")
SELECT
    gen_random_uuid(),
    ct."A",
    ct."B",
    CASE WHEN ct."B" = c."creator_id" THEN 'ADMIN'::"ChatRole" ELSE 'MEMBER'::"ChatRole" END
FROM "_ChatToUser" ct
JOIN "chats" c ON c."id" = ct."A";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_B_fkey";

-- DropTable
DROP TABLE "_ChatToUser";

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_chat_id_user_id_key" ON "chat_participants"("chat_id", "user_id");

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
