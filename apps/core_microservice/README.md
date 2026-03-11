## Core Microservice (`apps/core_microservice`)

### Purpose

The core microservice provides the main HTTP API for the platform: posts, comments, likes, follows, users, profiles, notifications, files, and real-time chat messaging. It is a NestJS application exposing REST endpoints and WebSocket events.

### Architecture

- **Framework**: NestJS (TypeScript)
- **Entry point**: `src/main.ts`
- **Root module**: `src/app.module.ts` (imports feature modules such as `PostModule`, `UsersModule`, `ProfilesModule`, `FollowModule`, `CommentModule`, `LikeModule`, `ChatModule`, `MessageModule`, `NotificationModule`, `AuthModule`, `FilesModule`, `HealthModule`)
- **Database**: Prisma-based repository (see respective modules/services)
- **Caching**: Redis, configured through `CacheModule` with `KeyvRedis`
- **Health checks**: `@nestjs/terminus` with HTTP, database, and memory checks at `GET /health`
- **Metrics**: Prometheus via `PrometheusModule.register({ path: '/metrics' })`
- **WebSockets**: Redis-backed `RedisIoAdapter` for real-time chat

### Running locally

From the repository root:

```bash
cd apps/core_microservice
npm install

# development
npm run start:dev

# production build
npm run start:prod
```

Default HTTP port: `3000` (configured in `src/main.ts`).

### Required environment variables

Configure a `.env` file in `apps/core_microservice` (or root, depending on deployment) with at least:

- `REDIS_URL` – Redis connection string for cache and WebSocket adapter
- `DATABASE_URL` – connection string for the primary database
- `AUTH_MICROSERVICE_URL` – base URL of the auth microservice (used by health checks)

`ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })` is used, so variables are read from `.env` in this app directory by default.

### Swagger / OpenAPI

Swagger is configured in `src/main.ts` using `@nestjs/swagger`:

- Swagger UI: `http://localhost:3000/api`
- OpenAPI document: served from the same base path
- Title: `Innogram API`
- Version: `1.0`
- Security scheme: HTTP bearer JWT under the name `JWT-auth`

Most controllers use:

- `@ApiTags` to group endpoints
- `@ApiBearerAuth('JWT-auth')` on protected routes
- `@ApiOperation` for human-readable summaries

DTOs under `src/**/dto/*.dto.ts` use `@ApiProperty` and `@ApiPropertyOptional` so request and response bodies are well described in the generated docs.

### Authentication and authorization

The core microservice expects JWTs issued by the `auth_microservice`:

- Clients obtain tokens from the auth microservice
- Tokens are sent in the `Authorization: Bearer <token>` header
- Guards such as `JwtAuthGuard` and `DeletedUserGuard` protect most state-changing endpoints

In Swagger UI, use the `Authorize` button and provide a valid JWT to explore protected endpoints.

### Health and monitoring

- `GET /health` – composite health check (database, memory, auth microservice HTTP check)
- `GET /metrics` – Prometheus metrics

These endpoints are intended for infrastructure probes and monitoring systems.

### Dependencies on other services

- **Auth microservice**: used for user authentication and health checks via `AUTH_MICROSERVICE_URL`
- **Notifications consumer microservice**: consumes messages emitted by this service for notification delivery
- **Client applications**: `client_app` and `docs` call this API for user-facing functionality and documentation examples

Ensure the auth and notification services are running when testing flows that depend on them (authentication, notifications, real-time features).
