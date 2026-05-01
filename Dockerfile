FROM node:20-bookworm-slim AS base

FROM base AS builder
WORKDIR /app
RUN corepack enable
RUN npm install -g turbo
COPY . .
ARG APP_NAME
RUN turbo prune ${APP_NAME} --docker

FROM base AS installer
WORKDIR /app
RUN corepack enable

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
ENV SKIP_NODE_VERSION_CHECK=1
RUN npm install --workspaces --include-workspace-root

COPY --from=builder /app/out/full/ .

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN npm run db:generate --workspaces --if-present

ARG APP_NAME
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
RUN npx turbo run build --filter=${APP_NAME}...

FROM base AS runner
WORKDIR /app
ARG APP_NAME
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
USER appuser

COPY --from=installer --chown=appuser:nodejs /app .

ENV RUN_APP_NAME=${APP_NAME}

CMD ["sh", "-c", "npm run start --workspace=apps/${RUN_APP_NAME}"]