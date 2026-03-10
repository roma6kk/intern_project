## Client App (`apps/client_app`)

### Purpose

The client app is the main user-facing web application for the Innogram platform. It is built with Next.js and communicates with the backend microservices for authentication, feeds, profiles, messaging, and notifications.

### Running locally

From the repository root:

```bash
cd apps/client_app
npm install
npm run dev
```

By default the app runs at `http://localhost:3002` (check configuration if this differs).

### Environment variables

Typical environment variables for the client app:

- `NEXT_PUBLIC_CORE_API_URL` – base URL of the core microservice (for example `http://localhost:3000`)
- `NEXT_PUBLIC_AUTH_API_URL` – base URL of the auth microservice (for example `http://localhost:3001`)

These variables are used to construct HTTP requests to backend services from the browser and server-side rendering environment.

### Backend integration

- Authentication flows call the auth microservice (sign in, sign up, refresh tokens).
- Feed, profile, post, comment, like, follow, chat, and notification features call the core microservice.
- JWTs issued by the auth microservice are included in requests, typically via cookies or authorization headers.

### API documentation references

For detailed information about the backend endpoints used by this app, see:

- Core microservice Swagger UI: `http://localhost:3000/api`
- Auth microservice Swagger UI: `http://localhost:3001/api-docs`
