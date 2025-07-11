# Contractor Dashboard

This monorepo contains a React frontend and Express backend written in TypeScript.

## Getting Started

```bash
npm install
npm run --workspace=@contractor-dashboard/backend build
npm run --workspace=@contractor-dashboard/frontend build
```

To run in Docker:

```bash
docker-compose up --build
```

## Observability

The backend emits JSON logs using Winston and exposes monitoring endpoints:

- `GET /healthz` – liveness probe
- `GET /readyz` – readiness probe (checks MongoDB connection)
- `GET /metrics` – Prometheus metrics

The frontend integrates Sentry error tracking via an error boundary. Provide a
`VITE_SENTRY_DSN` environment variable at build time to enable reporting.
