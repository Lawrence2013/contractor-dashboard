# Contractor Dashboard Application - Implementation Requirements

**Table of Contents**
1. [Introduction](#introduction)
2. [Goals & Scope](#goals--scope)
3. [Stakeholders & Personas](#stakeholders--personas)
4. [Architecture Overview](#architecture-overview)
5. [Technology Stack](#technology-stack)
6. [Security & Authentication](#security--authentication)
7. [Functional Requirements](#functional-requirements)
   - 7.1 [Service Provision Management](#service-provision-management)
   - 7.2 [Order Management](#order-management)
   - 7.3 [Dashboard UI Components](#dashboard-ui-components)
8. [API Endpoints](#api-endpoints)
9. [Data Model & Persistence](#data-model--persistence)
10. [Testing Strategy](#testing-strategy)
    - 10.1 [Unit Tests](#unit-tests)
    - 10.2 [Integration Tests](#integration-tests)
    - 10.3 [Coverage Targets & Tools](#coverage-targets--tools)
11. [CI/CD Pipeline](#cicd-pipeline)
12. [Non-Functional Requirements](#non-functional-requirements)
13. [Environments & Deployment](#environments--deployment)
14. [Observability & Monitoring](#observability--monitoring)
15. [Documentation & Coding Standards](#documentation--coding-standards)
16. [Appendix: Sample Workflows](#appendix-sample-workflows)

---

## 1. Introduction
This document captures the enterprise-grade, production-ready implementation requirements for the **Contractor Dashboard**—a React and Node.js web application enabling contractors to offer physical items (e.g., tables, chairs, graphics) as time-bound services and to manage client orders.

## 2. Goals & Scope
- **Enable service catalog management**: Contractors list and configure rentable items.
- **Secure order processing**: Contractors view, accept, partially or fully reject orders.
- **Scalable, maintainable architecture**: Microservices-friendly Node.js backend, React frontend.
- **High test coverage**: Unit and integration tests for all layers.
- **Robust security**: JWT-based auth, role-based access control, secure API.
- **Operational excellence**: CI/CD, logging, monitoring, alerting.

## 3. Stakeholders & Personas
- **Contractor**: Primary user; logs in, configures services, manages orders.
- **Client Event Manager**: Places orders; outside scope of dashboard.
- **Admin**: Optional superuser for multi-tenant oversight.

## 4. Architecture Overview
- **Frontend**: React (TypeScript), Redux or React Query for state, Tailwind CSS.
- **Backend**: Node.js (TypeScript) with Express/Koa, modular controllers + services.
- **Database**: MongoDB (Atlas or self-hosted), Mongoose ODM.
- **Auth**: JWT tokens issued by Auth microservice or integrated module.
- **Testing**: Jest for unit, Supertest + in-memory MongoDB for integration.
- **CI/CD**: GitHub Actions ➔ build, lint, test, Docker image, deploy to Kubernetes.

## 5. Technology Stack
- **Languages**: TypeScript (frontend & backend)
- **Frameworks**: React, Express (or Koa)
- **State Management**: React Query or Redux Toolkit
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Testing**: Jest, React Testing Library, Supertest, mongodb-memory-server
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Kubernetes
- **Monitoring**: Prometheus & Grafana, Log aggregation (ELK Stack)

## 6. Security & Authentication
- **Auth flow**: `POST /auth/login` ➔ issue JWT (access + refresh).
- **Token storage**: HTTP-only secure cookies for refresh; in-memory or localStorage for access.
- **RBAC**: Contractor role gating service and order endpoints.
- **Input validation & sanitization**: Celebrate (Joi) or Yup.
- **HTTPS enforcement**: TLS in all environments.
- **Rate limiting & WAF**: Prevent brute-force.
- **OWASP compliance**: Regular dependency audits.

## 7. Functional Requirements

### 7.1 Service Provision Management
- **Create Service**: `POST /services`
  - Payload: `{ name, description, imageUrl, availableFrom, availableTo, hourlyRate, dailyRate, quantity }`
- **Read Services**: `GET /services`
- **Update Service**: `PATCH /services/:id`
- **Delete Service**: `DELETE /services/:id`
- **Constraints**: Date ranges cannot overlap for same item.

### 7.2 Order Management
- **List Incoming Orders**: `GET /orders?status=pending`
- **View Order Details**: `GET /orders/:id`
- **Accept Order**: `PATCH /orders/:id/accept`
- **Reject Order**: `PATCH /orders/:id/reject` (full or specify `{ lineItemIds: [] }`)
- **Notifications**: WebSocket or polling for new orders.

### 7.3 Dashboard UI Components
- **Login Page**
- **Service Catalog**: data table, filters, pagination, modals for create/edit
- **Order Queue**: table with status badges, action buttons (Accept, Reject)
- **Order Detail View**: timeline, line-item selection for partial reject
- **Global Layout**: responsive sidebar, header with notifications

## 8. API Endpoints
\`\`\`yaml
/auth:
  POST /login
  POST /refresh
/services:
  GET /
  POST /
  PATCH /:id
  DELETE /:id
/orders:
  GET /?status=pending
  GET /:id
  PATCH /:id/accept
  PATCH /:id/reject   # body: { lineItemIds?: string[] }
\`\`\`
- All endpoints secured via \`Authorization: Bearer <token>\`.

## 9. Data Model & Persistence
**Collections**:
- \`users\` (contractors, admins)
- \`services\`
- \`orders\`

**Example: Service Schema (Mongoose)**
\`\`\`ts
interface Service {
  _id: ObjectId;
  contractorId: ObjectId;
  name: string;
  description?: string;
  imageUrl?: string;
  availableFrom: Date;
  availableTo: Date;
  rates: { hourly: number; daily: number };
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`
**Order Schema** includes line items referencing \`services\`, status enum [\`pending\`, \`accepted\`, \`rejected\`], timestamps, and optional rejection notes.

## 10. Testing Strategy

### 10.1 Unit Tests
- **Frontend**: Jest + React Testing Library for components, custom hooks, utility functions.
- **Backend**: Jest for controllers, services, data-access modules; mock external dependencies (Mongo, auth service).

### 10.2 Integration Tests
- **API**: Supertest with `mongodb-memory-server` to test end-to-end CRUD and order workflows.
- **Auth Flows**: login ➔ access protected, refresh ➔ new token.

### 10.3 Coverage Targets & Tools
- **Targets**: ≥90% branch and statement coverage across codebase.
- **Tools**: Istanbul (via Jest), coverage reports uploaded to CI.

## 11. CI/CD Pipeline
- **Lint & Typecheck**: `npm run lint`, `npm run typecheck`
- **Unit & Integration Tests**: `npm test -- --coverage`
- **Build**: Frontend (`npm run build`), Backend Docker image.
- **Publish**: Push Docker image to registry.
- **Deploy**: Helm charts to Kubernetes clusters (staging & prod).
- **Notifications**: Slack on failure/success.

## 12. Non-Functional Requirements
- **Performance**: API p95 <200ms; frontend initial render <1s.
- **Scalability**: Horizontal scaling behind load balancer.
- **Reliability**: ≥99.9% uptime.
- **Localization**: i18n-ready.
- **Accessibility**: WCAG AA standards.

## 13. Environments & Deployment
- **Environments**: dev, staging, prod.
- **Configuration**: Twelve-Factor App; env vars via Kubernetes Secrets.
- **DB Migrations**: Automated with `migrate-mongo`.

## 14. Observability & Monitoring
- **Logging**: Structured JSON logs via Winston; shipped to ELK.
- **Metrics**: Prometheus exporters; dashboards in Grafana.
- **Error Tracking**: Sentry integration.
- **Health Checks**: /healthz and /readyz endpoints.

## 15. Documentation & Coding Standards
- **API Docs**: OpenAPI (Swagger) spec available at `/docs`.
- **Code Style**: ESLint + Prettier with standardized config.
- **Git Workflow**: GitHub Flow; PR reviews required; conventional commits.
- **Onboarding Docs**: README with setup, run, test instructions.

## 16. Appendix: Sample Workflows
1. **Add New Service**: Login ➔ Services ➔ Create ➔ Fill form ➔ Save ➔ Confirm list update.
2. **Reject Partial Order**: Orders ➔ Select Order ➔ Reject ➔ Choose items ➔ Confirm.

---

*Prepared for implementation planning and developer onboarding.*
