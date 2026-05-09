## Docs App (`apps/docs`)

### Purpose

The docs app is a Next.js application that serves documentation for the Innogram platform. It can host developer guides, API usage examples, onboarding documentation, and links to the generated Swagger docs of the backend services.

### Running locally

From the repository root:

```bash
cd apps/docs
npm install
npm run dev
```

By default the app runs at `http://localhost:3003` unless configured otherwise.

### Content structure

Documentation pages live under the `app/` directory. You can extend the docs by adding new pages and sections that describe:

- High-level architecture of the platform
- Auth flows and token usage
- API usage patterns and common workflows
- Links or embeds for backend Swagger documentation

### API documentation links

Use the following URLs in docs pages when referencing backend APIs:

- Core microservice Swagger UI: `http://localhost:3000/api`
- Auth microservice Swagger UI: `http://localhost:3001/api-docs`

In production, replace these with the appropriate hostnames and ports for your deployment environment.
