-- Rollback enum placement fix.
-- Switch columns back to `main` enums, then drop target-schema enums.

-- auth.accounts
ALTER TABLE auth.accounts ALTER COLUMN role DROP DEFAULT;
ALTER TABLE auth.accounts
  ALTER COLUMN role TYPE main."PlatformRole"
  USING role::text::main."PlatformRole";
ALTER TABLE auth.accounts ALTER COLUMN role SET DEFAULT 'USER'::main."PlatformRole";

ALTER TABLE auth.accounts ALTER COLUMN state DROP DEFAULT;
ALTER TABLE auth.accounts
  ALTER COLUMN state TYPE main."AccountState"
  USING state::text::main."AccountState";
ALTER TABLE auth.accounts ALTER COLUMN state SET DEFAULT 'ACTIVE'::main."AccountState";

-- notifications.notifications
ALTER TABLE notifications.notifications
  ALTER COLUMN type TYPE main."NotificationType"
  USING type::text::main."NotificationType";

-- Drop enum types (only safe if no longer referenced).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype='e' AND n.nspname='auth' AND t.typname='PlatformRole'
  ) THEN
    DROP TYPE auth."PlatformRole";
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype='e' AND n.nspname='auth' AND t.typname='AccountState'
  ) THEN
    DROP TYPE auth."AccountState";
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype='e' AND n.nspname='notifications' AND t.typname='NotificationType'
  ) THEN
    DROP TYPE notifications."NotificationType";
  END IF;
END$$;

