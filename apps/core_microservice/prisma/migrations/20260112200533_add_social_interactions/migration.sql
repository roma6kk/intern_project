/*
  Warnings:

  - A unique constraint covering the columns `[author_id,post_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[author_id,comment_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "parent_id" TEXT;

-- AlterTable
ALTER TABLE "follows" ADD COLUMN     "status" "FollowStatus" NOT NULL DEFAULT 'ACCEPTED';

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "comment_id" TEXT,
ALTER COLUMN "post_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "likes_author_id_post_id_key" ON "likes"("author_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_author_id_comment_id_key" ON "likes"("author_id", "comment_id");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
