#!/usr/bin/env node
/**
 * Apply Prisma migrations for the prod Docker stack.
 *
 * Order matters:
 * 1. core_microservice — owns schema DDL (auth/main/notifications)
 * 2. auth + notifications_consumer — baseline resolve only (shared DB)
 *
 * Run after: docker compose -f docker-compose.prod.yml up -d postgres
 * (containers innogram-core, innogram-auth, innogram-consumer must exist)
 */
import { execSync } from 'node:child_process';

function run(cmd) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit' });
}

function tryRun(cmd) {
  try {
    run(cmd);
    return true;
  } catch {
    return false;
  }
}

const core = 'innogram-core';
const auth = 'innogram-auth';
const consumer = 'innogram-consumer';

for (const name of [core, auth, consumer]) {
  try {
    execSync(`docker inspect -f "{{.State.Running}}" ${name}`, { stdio: 'pipe' });
  } catch {
    console.error(
      `Container "${name}" is not running. Start the stack first:\n` +
        '  docker compose -f docker-compose.prod.yml up -d',
    );
    process.exit(1);
  }
}

run(
  `docker exec ${core} npm run db:migrate:deploy --workspace=core_microservice`,
);

if (
  !tryRun(
    `docker exec ${auth} npm run db:migrate:deploy --workspace=auth_microservice`,
  )
) {
  run(
    `docker exec -w /app/apps/auth_microservice ${auth} npx prisma migrate resolve --applied 20260320130231_update`,
  );
  run(
    `docker exec ${auth} npm run db:migrate:deploy --workspace=auth_microservice`,
  );
}

if (
  !tryRun(
    `docker exec ${consumer} npm run db:migrate:deploy --workspace=notifications_consumer_microservice`,
  )
) {
  run(
    `docker exec -w /app/apps/notifications_consumer_microservice ${consumer} npx prisma migrate resolve --applied 20260406153000_baseline`,
  );
  run(
    `docker exec ${consumer} npm run db:migrate:deploy --workspace=notifications_consumer_microservice`,
  );
}

console.log('\nDatabase migrations applied.\n');
