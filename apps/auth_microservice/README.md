## Auth Microservice (`apps/auth_microservice`)

### Purpose

The auth microservice is responsible for user authentication and authorization for the Innogram platform. It issues and validates JWTs, manages user sessions, and exposes endpoints for sign up, sign in, token refresh, and related auth flows.

### Architecture

- **Framework**: Express (TypeScript)
- **Entry point**: `src/app.ts`
- **Routing**: `src/routes/auth.routes.ts` mounted under `/internal/auth`
- **Database**: Prisma via `connectDB` (`src/config/prisma.ts`)
- **Cache**: Redis (`src/config/redis.ts`)
- **Metrics**: Prometheus metrics exposed on `/metrics`
- **Health**: Lightweight health check on `/health`

### Running locally

From the repository root:

```bash
cd apps/auth_microservice
npm install
npm run dev
```

The service listens on `PORT` from the environment (for example `3001`).

### Required environment variables

Define a `.env` file for the auth microservice with at least:

- `PORT` – port for the HTTP server
- `DATABASE_URL` – Prisma database connection string
- `REDIS_URL` – Redis connection string
- `JWT_SECRET` and other JWT-related settings used in token generation and validation
- OAuth-related variables if social login is enabled (for example Google client ID/secret)

### API surface

Routes are mounted under the `/internal/auth` prefix. Typical groups include:

- Authentication endpoints for sign up, sign in, logout, and token refresh
- User identity endpoints used by other services
- Internal-only endpoints used by the core microservice

Refer to the Swagger documentation for the complete list of routes, request bodies, and responses.

### Swagger / OpenAPI

Swagger is configured in `src/app.ts` using `swagger-ui-express` and `swagger-jsdoc`.

- Swagger UI: `http://localhost:<PORT>/api-docs`
- OpenAPI JSON: `http://localhost:<PORT>/api-docs-json`

The OpenAPI document describes:

- Title: `Auth Microservice API`
- Version: `1.0.0`
- HTTP bearer authentication scheme (`bearerAuth`) with JWT tokens

Controllers and route handlers should be annotated using JSDoc-style comments or shared schemas so that the `swagger-jsdoc` configuration can generate accurate API docs from `src/routes/**/*.ts`.

### Integration with other services

- The core microservice uses this service to authenticate users and validate tokens.
- Client applications obtain tokens from the auth microservice and send them in the `Authorization: Bearer <token>` header when calling other backend APIs.

Ensure the auth microservice is running and reachable from the core microservice at the URL configured via `AUTH_MICROSERVICE_URL`.

