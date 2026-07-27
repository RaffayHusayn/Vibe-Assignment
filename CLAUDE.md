# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GTM intent pipeline tool bridging on-field marketing and sales. Captures contacts at events (just an email is enough), automatically extracts name/company, enriches via Apollo API, and enables AI-powered email outreach for sales reps.

## Commands

```bash
yarn install        # Install dependencies (auto-runs prisma generate via postinstall)
yarn dev            # Local dev server (Next.js)
yarn build          # Production build
yarn lint           # ESLint
npx prisma migrate dev    # Run database migrations
npx prisma generate       # Regenerate Prisma client (output: src/generated/prisma/)
```

No test framework is configured.

## Architecture

Three parallel domains under `src/`: **core**, **sales**, **events**.

- `core/` — shared infrastructure: data access, server actions, integrations, shell UI, utilities
- `sales/` and `events/` — thin domain layers containing only their own UI components, strings, and config

`app/` is routing only (pages and layouts). All business logic lives in `src/core/actions/`. Mutations are Next.js server actions with `"use server"` that call Prisma and revalidate paths.

### Key paths

| Path | Purpose |
|------|---------|
| `src/core/actions/` | Server actions (mutations). Grouped by record type, not domain |
| `src/core/integrations/` | External API clients: `openai.ts` (email drafting), `apollo.ts` (company enrichment) |
| `src/core/db.ts` | Prisma client singleton with `@prisma/adapter-pg` for Neon Postgres |
| `src/core/ui/` | Shell components (AppShellLayout, TopNav, Sidebar, PageHeader) |
| `src/core/utils/` | Email parsing (`extract.ts`), validation (`validation.ts`) |
| `src/sales/ui/` | Pipeline kanban board (dnd-kit), company detail, email draft generator |
| `src/events/ui/` | Event capture form, attendees table, event cards |
| `prisma/schema.prisma` | Data model — output goes to `src/generated/prisma/` |
| `app/(dashboard)/` | Grouped route layout with sidebar + header shell |

### Data model

Six models with `Core_`/`Sales_`/`Events_` prefixes. Key relationships:
- `Core_Company` (unique on `domain`) ← many `Core_Contact` (unique on `email`)
- `Core_Contact` ← many `Core_TouchPoint` → `Events_Event`
- `Core_Company` → one `Sales_Pipeline` (auto-created on first contact capture)
- `Sales_Pipeline` ← many `Sales_ActivityTimeline`

Pipeline stages: `new` → `contacted` → `qualified` → `closed` (enum `SalesStage`).

### Integration patterns

**Apollo enrichment** (`src/core/integrations/apollo.ts`): Falls back to fixture data in `apollo-fixtures/` when `APOLLO_API_KEY` is unset. Maps raw response via `mapOrganization` to normalized shape.

**OpenAI email drafting** (`src/core/integrations/openai.ts`): Uses gpt-4o-mini. System prompt enforces JSON output `{ subject, body }`. Context includes company profile, recipient details, touchpoint notes. Throws `EmailDraftError` for expected failures.

### UI patterns

- **Mantine 9** component library with custom theme in `src/core/theme.ts`
- **Tailwind CSS 4** alongside Mantine (both configured via PostCSS)
- **dnd-kit** for kanban drag-and-drop with optimistic updates and rollback on error
- **`useActionState`** for form state in client components calling server actions
- Path alias: `@/*` maps to repo root (use as `@/src/...`, `@/app/...`)

## Environment Variables

- `DATABASE_URL` — Neon Postgres pooled connection string (required)
- `DIRECT_URL` — Neon Postgres direct connection for migrations (required for `prisma migrate`)
- `OPENAI_API_KEY` — For email drafting (optional; drafting disabled without it)
- `APOLLO_API_KEY` — For live company enrichment (optional; uses fixtures without it)
