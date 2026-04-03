-- Ensure Prisma multi-schema enums exist in the correct schema.
-- We create enum types in target schemas and switch columns to those types.

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS notifications;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype = 'e'
      AND n.nspname = 'auth'
      AND t.typname = 'PlatformRole'
  ) THEN
    CREATE TYPE auth."PlatformRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype = 'e'
      AND n.nspname = 'auth'
      AND t.typname = 'AccountState'
  ) THEN
    CREATE TYPE auth."AccountState" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype = 'e'
      AND n.nspname = 'notifications'
      AND t.typname = 'NotificationType'
  ) THEN
    CREATE TYPE notifications."NotificationType" AS ENUM ('LIKE', 'COMMENT', 'FOLLOW', 'SYSTEM', 'MENTION');
  END IF;
END$$;

-- Switch existing columns to target-schema enums.
ALTER TABLE auth.accounts
  ALTER COLUMN role DROP DEFAULT;

ALTER TABLE auth.accounts
  ALTER COLUMN state DROP DEFAULT;

ALTER TABLE auth.accounts
  ALTER COLUMN role TYPE auth."PlatformRole"
  USING role::text::auth."PlatformRole";

ALTER TABLE auth.accounts
  ALTER COLUMN state TYPE auth."AccountState"
  USING state::text::auth."AccountState";

ALTER TABLE auth.accounts
  ALTER COLUMN role SET DEFAULT 'USER'::auth."PlatformRole";

ALTER TABLE auth.accounts
  ALTER COLUMN state SET DEFAULT 'ACTIVE'::auth."AccountState";

ALTER TABLE notifications.notifications
  ALTER COLUMN type TYPE notifications."NotificationType"
  USING type::text::notifications."NotificationType";

