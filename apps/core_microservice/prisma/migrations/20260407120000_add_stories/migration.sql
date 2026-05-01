-- Add Stories feature (stories + views + reactions + exclusions) and attach assets to stories.

-- CreateTable
CREATE TABLE "main"."stories" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "caption" TEXT,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."story_views" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "viewer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."story_reactions" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '❤️',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "story_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."story_exclusions" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "excluded_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_exclusions_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "main"."assets" ADD COLUMN "story_id" TEXT;

-- CreateIndex
CREATE INDEX "stories_author_id_created_at_idx" ON "main"."stories"("author_id", "created_at");
CREATE INDEX "stories_expires_at_idx" ON "main"."stories"("expires_at");
CREATE INDEX "stories_author_id_expires_at_idx" ON "main"."stories"("author_id", "expires_at");

CREATE UNIQUE INDEX "story_views_story_id_viewer_id_key" ON "main"."story_views"("story_id", "viewer_id");
CREATE INDEX "story_views_story_id_created_at_idx" ON "main"."story_views"("story_id", "created_at");
CREATE INDEX "story_views_viewer_id_created_at_idx" ON "main"."story_views"("viewer_id", "created_at");

CREATE UNIQUE INDEX "story_reactions_story_id_user_id_key" ON "main"."story_reactions"("story_id", "user_id");
CREATE INDEX "story_reactions_story_id_created_at_idx" ON "main"."story_reactions"("story_id", "created_at");
CREATE INDEX "story_reactions_user_id_created_at_idx" ON "main"."story_reactions"("user_id", "created_at");

CREATE UNIQUE INDEX "story_exclusions_author_id_excluded_user_id_key" ON "main"."story_exclusions"("author_id", "excluded_user_id");
CREATE INDEX "story_exclusions_author_id_created_at_idx" ON "main"."story_exclusions"("author_id", "created_at");
CREATE INDEX "story_exclusions_excluded_user_id_created_at_idx" ON "main"."story_exclusions"("excluded_user_id", "created_at");

-- AddForeignKey
ALTER TABLE "main"."stories" ADD CONSTRAINT "stories_author_id_fkey"
  FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "main"."story_views" ADD CONSTRAINT "story_views_story_id_fkey"
  FOREIGN KEY ("story_id") REFERENCES "main"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "main"."story_views" ADD CONSTRAINT "story_views_viewer_id_fkey"
  FOREIGN KEY ("viewer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "main"."story_reactions" ADD CONSTRAINT "story_reactions_story_id_fkey"
  FOREIGN KEY ("story_id") REFERENCES "main"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "main"."story_reactions" ADD CONSTRAINT "story_reactions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "main"."story_exclusions" ADD CONSTRAINT "story_exclusions_author_id_fkey"
  FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "main"."story_exclusions" ADD CONSTRAINT "story_exclusions_excluded_user_id_fkey"
  FOREIGN KEY ("excluded_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "main"."assets" ADD CONSTRAINT "assets_story_id_fkey"
  FOREIGN KEY ("story_id") REFERENCES "main"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

