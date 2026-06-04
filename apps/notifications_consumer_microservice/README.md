## Notifications Consumer Microservice (`apps/notifications_consumer_microservice`)

### Purpose

The notifications consumer microservice listens to a RabbitMQ queue and processes notification-related messages for the Innogram platform. It is responsible for receiving events from other services and performing notification delivery logic.

### Architecture

- **Framework**: NestJS microservices (TypeScript)
- **Entry point**: `src/main.ts`
- **Transport**: RabbitMQ via `@nestjs/microservices` with `Transport.RMQ`
- **Queue**: `notifications_queue`

The service does not expose an HTTP API. Instead, it runs as a background worker consuming messages from the configured RabbitMQ queue.

### Running locally

From the repository root:

```bash
cd apps/notifications_consumer_microservice
npm install
npm run start:dev
```

Ensure a RabbitMQ instance is running and reachable.

### Required environment variables

Configure a `.env` file or environment variables with at least:

- `RABBITMQ_URL` – connection string to the RabbitMQ broker (for example `amqp://guest:guest@localhost:5672`)

If `RABBITMQ_URL` is not provided, the service defaults to `amqp://guest:guest@localhost:5672`.

### Message contracts

The service expects messages on `notifications_queue` that represent notification events (for example, new likes, comments, follows, or other user actions). Payload structures are defined in the core microservice and related modules that publish to this queue.

When integrating a new event type, ensure that:

- The producing service publishes to `notifications_queue` with an agreed message shape.
- The notifications consumer has a corresponding handler that can process the payload.

### Operations and monitoring

- Logs from the service show when it connects to RabbitMQ and when it is listening for messages.
- Errors in message handling should be visible in the service logs.

Run this service alongside the core microservice and auth microservice when testing features that emit notifications.

