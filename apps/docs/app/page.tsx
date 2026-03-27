import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Innogram Documentation</h1>
        <p>
          This site contains developer documentation for the Innogram
          platform: backend services, APIs and client applications.
        </p>

        <section>
          <h2>Services</h2>
          <ul>
            <li>
              <strong>Core microservice</strong> – main NestJS HTTP API for
              posts, comments, likes, follows, users, profiles, notifications,
              files and chat.
            </li>
            <li>
              <strong>Auth microservice</strong> – Express service for
              authentication and issuing JWT tokens.
            </li>
            <li>
              <strong>Notifications consumer</strong> – NestJS RMQ worker
              processing notification events.
            </li>
            <li>
              <strong>Client app</strong> – Next.js user-facing web
              application.
            </li>
            <li>
              <strong>Docs app</strong> – this documentation site.
            </li>
          </ul>
        </section>

        <section>
          <h2>API documentation</h2>
          <p>Swagger / OpenAPI endpoints in local development:</p>
          <ul>
            <li>
              Core microservice Swagger UI:{" "}
              <a href="http://localhost:3000/api" target="_blank" rel="noreferrer">
                http://localhost:3000/api
              </a>
            </li>
            <li>
              Auth microservice Swagger UI:{" "}
              <a href="http://localhost:3001/api-docs" target="_blank" rel="noreferrer">
                http://localhost:3001/api-docs
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Getting started</h2>
          <ol>
            <li>
              Run the core API in <code>apps/core_microservice</code>.
            </li>
            <li>
              Run the auth service in <code>apps/auth_microservice</code>.
            </li>
            <li>
              Run the client app in <code>apps/client_app</code>.
            </li>
            <li>
              Open the Swagger UIs and use this docs app for guides and
              examples.
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
