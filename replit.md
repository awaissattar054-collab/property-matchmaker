# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations (gpt-5-mini for chat)

## Artifacts

### AI Property Matchmaker (`artifacts/property-matchmaker`)
- React + Vite frontend at `/`
- AI-powered chat interface for Pakistani real estate
- Pages: AI Chat, Browse Properties, My Visits, Market Stats
- Uses framer-motion, recharts, wouter

### API Server (`artifacts/api-server`)
- Express 5 REST API at `/api`
- Routes: /properties, /visits, /chat/message

## Database Schema

- **properties**: id, title, area, city, price, priceFormatted, type, bedrooms, bathrooms, sizeSqFt, imageUrl, description, features, isFeatured, phase, createdAt
- **visits**: id, propertyId, name, phone, email, visitDate, visitTime, notes, status, createdAt

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
