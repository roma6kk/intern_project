-- Rollback for schema split migration.
CREATE SCHEMA IF NOT EXISTS public;

ALTER TABLE IF EXISTS auth.users SET SCHEMA public;
ALTER TABLE IF EXISTS auth.accounts SET SCHEMA public;

ALTER TABLE IF EXISTS main.profiles SET SCHEMA public;
ALTER TABLE IF EXISTS main.follows SET SCHEMA public;
ALTER TABLE IF EXISTS main.posts SET SCHEMA public;
ALTER TABLE IF EXISTS main.assets SET SCHEMA public;
ALTER TABLE IF EXISTS main.comments SET SCHEMA public;
ALTER TABLE IF EXISTS main.likes SET SCHEMA public;
ALTER TABLE IF EXISTS main.chats SET SCHEMA public;
ALTER TABLE IF EXISTS main.chat_participants SET SCHEMA public;
ALTER TABLE IF EXISTS main.messages SET SCHEMA public;
ALTER TABLE IF EXISTS main.reports SET SCHEMA public;
ALTER TABLE IF EXISTS main.user_warnings SET SCHEMA public;
ALTER TABLE IF EXISTS main.user_sanctions SET SCHEMA public;
ALTER TABLE IF EXISTS main.moderation_logs SET SCHEMA public;

ALTER TABLE IF EXISTS notifications.notifications SET SCHEMA public;
