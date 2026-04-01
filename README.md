## Innogram Monorepo

### Overview

This repository contains the core backend services and frontend applications for the Innogram platform. It is organized as a monorepo with multiple apps and shared packages.

### Structure

- `apps/core_microservice` – NestJS HTTP API providing posts, comments, likes, follows, users, profiles, notifications, files, and chat functionality.
- `apps/auth_microservice` – Express-based authentication service responsible for issuing and validating JWTs.
- `apps/assistant_microservice` – NestJS service for chat AI features (LLM-backed topic suggestions, summaries, Q&A); called by core over HTTP with a service token.
- `apps/notifications_consumer_microservice` – NestJS RabbitMQ consumer handling notification events from other services.
- `apps/client_app` – Next.js client application, the main user-facing web UI.
- `apps/docs` – Next.js documentation site for developer and platform docs.
- `packages/eslint-config` – Shared ESLint configuration package.

### Getting started

Install dependencies at the repository root using your preferred package manager, then install and run each app from its directory.

Example for the core microservice:

```bash
cd apps/core_microservice
npm install
npm run start:dev
```

Refer to each app’s README for detailed setup and environment variable configuration.

### Local CI/CD verification

To locally reproduce what runs in CI/CD, follow these steps from the repository root.

#### 1. Prerequisites

- **Node.js**: version 20.x (CI uses Node 20). Newer major versions (for example 24) are blocked by `scripts/check-node-version.mjs` because Prisma engines are not available for them yet.
- **npm**: use the version bundled with your Node 20 installation.
- **Docker**: required for postgres/redis/rabbitmq/minio in e2e tests.

Install dependencies once:

```bash
cd .
npm ci
```

#### 2. Quality job (lint, build, unit tests)

This reproduces the `quality` job from `.github/workflows/ci-cd.yml`:

```bash
npx turbo db:generate
npx turbo lint
npx turbo build
npx turbo test
```

All commands should finish successfully before opening a PR.

#### 3. E2E and Playwright tests

This reproduces the `e2e-tests` job.

1. Start infrastructure (same services as in CI):

```bash
docker compose up -d postgres redis rabbitmq minio
```

2. Generate Prisma clients and apply DB migrations:

```bash
npx turbo db:generate

cd apps/core_microservice
npx prisma migrate deploy

cd ../auth_microservice
npx prisma migrate deploy

cd ../..  # back to repo root
```

3. Run backend e2e tests:

```bash
npx turbo test:e2e --filter=core_microservice
```

4. Install Playwright browsers for the client app:

```bash
cd apps/client_app
npx playwright install
cd ../..  # back to repo root
```

5. Start services for Playwright in separate terminals (or using a process manager). The Next.js client must know the API base URL when `next dev` starts (same as in CI):

```bash
export NEXT_PUBLIC_API_URL=http://127.0.0.1:3000
export NEXT_PUBLIC_WS_URL=http://127.0.0.1:3000
npx turbo dev --filter=core_microservice
npx turbo dev --filter=auth_microservice
npx turbo dev --filter=notifications_consumer_microservice
npx turbo dev --filter=client_app
```

Ensure core and auth health endpoints are up:

- `http://localhost:3000/health`
- `http://localhost:3001/health`

6. Run Playwright tests from the client app:

```bash
cd apps/client_app
NEXT_PUBLIC_API_URL=http://localhost:3000 npx playwright test
```

If these tests pass, the `e2e-tests` job in CI should also be green.

#### 4. Docker build (optional)

The `docker-push` job in CI builds and pushes images for each service. Locally you can verify that the images build without pushing:

```bash
docker build -t innogram-core_microservice --build-arg SCOPE=core_microservice -f Dockerfile .
docker build -t innogram-auth_microservice --build-arg SCOPE=auth_microservice -f Dockerfile .
docker build -t innogram-notifications_consumer_microservice --build-arg SCOPE=notifications_consumer_microservice -f Dockerfile .
docker build -t innogram-client_app --build-arg SCOPE=client_app -f Dockerfile .
```

If all builds succeed and steps above pass, your changes are very likely to pass the CI/CD pipeline.

### Swagger and API documentation

Backend services expose Swagger/OpenAPI documentation:

- Core microservice Swagger UI: `http://localhost:3000/api`
- Auth microservice Swagger UI: `http://localhost:3001/api-docs`

The docs app can link to these Swagger endpoints to provide end-to-end API guides and examples.

