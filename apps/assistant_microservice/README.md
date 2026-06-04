# Assistant microservice

Internal HTTP API for chat AI features (topic suggestions, dialog summary, Q&A). Protected by `X-Assistant-Service-Token`.

## Environment

| Variable | Description |
|----------|-------------|
| `ASSISTANT_PORT` | HTTP port (default `3003`) |
| `ASSISTANT_SERVICE_SECRET` | Shared secret; must match core `ASSISTANT_SERVICE_SECRET` |
| `LLM_API_KEY` | API key for OpenAI-compatible provider |
| `LLM_BASE_URL` | Base URL (default `https://api.openai.com/v1`) |
| `LLM_MODEL` | Model id (default `gpt-4o-mini`) |
| `LLM_TIMEOUT_MS` | Request timeout (default `20000`) |
| `LLM_JSON_MODE` | `true` / `false` — send `response_format: json_object` when supported |

If `LLM_API_KEY` is unset, the service returns rule-based fallbacks with `meta.source: "fallback"`.

## Run

```bash
cd apps/assistant_microservice
npm install
npm run dev
```

Health: `GET /health`  
Metrics: `GET /metrics`
