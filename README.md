## Innogram Monorepo

### Overview

This repository contains the core backend services and frontend applications for the Innogram platform. It is organized as a monorepo with multiple apps and shared packages.

### Structure

- `apps/core_microservice` – NestJS HTTP API providing posts, comments, likes, follows, users, profiles, notifications, files, and chat functionality.
- `apps/auth_microservice` – Express-based authentication service responsible for issuing and validating JWTs.
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

### Swagger and API documentation

Backend services expose Swagger/OpenAPI documentation:

- Core microservice Swagger UI: `http://localhost:3000/api`
- Auth microservice Swagger UI: `http://localhost:3001/api-docs`

The docs app can link to these Swagger endpoints to provide end-to-end API guides and examples.

