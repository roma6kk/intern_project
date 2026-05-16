-- Allow multiple reaction rows per user per story (different emojis / repeated taps).
DROP INDEX IF EXISTS "main"."story_reactions_story_id_user_id_key";
