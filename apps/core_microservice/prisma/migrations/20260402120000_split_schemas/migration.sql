-- Split shared public schema into auth/main/notifications schemas.
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS main;
CREATE SCHEMA IF NOT EXISTS notifications;

-- Move identity/auth tables.
ALTER TABLE IF EXISTS public.users SET SCHEMA auth;
ALTER TABLE IF EXISTS public.accounts SET SCHEMA auth;
ALTER TABLE IF EXISTS main.users SET SCHEMA auth;
ALTER TABLE IF EXISTS main.accounts SET SCHEMA auth;

-- Keep profile and core domain in main schema.
ALTER TABLE IF EXISTS public.profiles SET SCHEMA main;
ALTER TABLE IF EXISTS public.follows SET SCHEMA main;
ALTER TABLE IF EXISTS public.posts SET SCHEMA main;
ALTER TABLE IF EXISTS public.assets SET SCHEMA main;
ALTER TABLE IF EXISTS public.comments SET SCHEMA main;
ALTER TABLE IF EXISTS public.likes SET SCHEMA main;
ALTER TABLE IF EXISTS public.chats SET SCHEMA main;
ALTER TABLE IF EXISTS public.chat_participants SET SCHEMA main;
ALTER TABLE IF EXISTS public.messages SET SCHEMA main;
ALTER TABLE IF EXISTS public.reports SET SCHEMA main;
ALTER TABLE IF EXISTS public.user_warnings SET SCHEMA main;
ALTER TABLE IF EXISTS public.user_sanctions SET SCHEMA main;
ALTER TABLE IF EXISTS public.moderation_logs SET SCHEMA main;

-- Move notification table to dedicated schema.
ALTER TABLE IF EXISTS public.notifications SET SCHEMA notifications;
ALTER TABLE IF EXISTS main.notifications SET SCHEMA notifications;
