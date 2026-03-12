# gemini.md — PM Tool MVP

## Project Overview

Production-grade MVP of a project management tool for software teams.

**Architecture:** Next.js (App Router) + Supabase modular monolith. No separate backend.

**Tech Stack:** TypeScript, Tailwind CSS, shadcn/ui, dnd-kit, React Hook Form, Zod, TanStack Query, Supabase (Auth/Postgres/Storage/Realtime), Vercel

---

## Documentation Index

All project documentation lives in the root folder. Read these before writing any code.

### 1. Product & Architecture Spec
**File:** [pm_tool_implementation_plan.md](pm_tool_implementation_plan.md)
- Product scope (in/out of scope for MVP)
- 11 product modules with features and fields
- Database design (10 tables with columns)
- Row-level security strategy
- Server/client rendering strategy
- Data mutation strategy (Server Actions vs Route Handlers)
- Realtime strategy
- Permissions strategy (4 roles)
- Folder structure
- UI pages to build
- Milestones and implementation sequence
- Environment variables
- Error handling and UX rules
- Security checklist
- Performance notes
- Deployment plan
- Definition of MVP done

### 2. Coding Instructions & Rules
**File:** [pm_tool_gemini_coding_instructions.md](pm_tool_gemini_coding_instructions.md)
- Non-negotiable engineering principles
- Feature-by-feature implementation rules
- Required folder structure with placement rules
- App routing plan
- UI and design rules (styling, UX, accessibility)
- Data model requirements (all table schemas)
- Database rules (RLS, constraints, enums)
- Authentication requirements
- Server vs Client Component rules
- Mutation strategy with validation requirements
- Form and validation rules
- Error handling rules
- File upload rules
- Permissions rules (centralized helpers)
- Query and data access rules
- Build order (9 steps)
- Testing expectations
- Code style expectations
- Deliverables checklist

### 3. Step-by-Step Implementation Plan
**File:** [pm_tool_step_by_step_plan.md](pm_tool_step_by_step_plan.md)
- Architectural decisions to lock in before coding
- 9 implementation steps with exact files to create per step
- SQL migration details
- Server action code patterns
- Component structure per feature
- Kanban position calculation strategy
- Dependency map between steps
- Complete file inventory (~85 files)
- Checkpoints after each step

### 4. Best Practices & Code Organization
**File:** [pm_tool_best_practices.md](pm_tool_best_practices.md)
- Project structure principles
- File naming and organization conventions
- TypeScript strict mode patterns and type usage
- Server action universal pipeline
- Query function patterns
- Component patterns (Server vs Client)
- Form patterns with full checklist
- Permission patterns (two-layer enforcement)
- Error handling patterns (actions vs queries vs UI)
- Supabase client usage and security rules
- Realtime usage patterns with cleanup
- Tailwind and UI patterns (spacing, colors, responsive)
- Import organization order
- Git commit conventions
- Performance best practices (server, client, Supabase)

### 5. Test Scenarios
**File:** [pm_tool_test_scenarios.md](pm_tool_test_scenarios.md)
- Testing strategy and tools
- Module-by-module test cases:
  - Authentication (19 tests)
  - Organizations & Team (14 tests)
  - Projects (20 tests)
  - Tasks (22 tests)
  - Kanban Board (18 tests)
  - Comments (14 tests)
  - Attachments (17 tests)
  - Notifications (11 tests)
  - Activity Logs (13 tests)
  - Dashboard (8 tests)
  - Permissions (10 tests)
- Cross-cutting tests:
  - RLS policy tests (12 tests)
  - UX state tests (12 tests)
  - Security tests (8 tests)
  - Responsive design tests (8 tests)
- E2E flow tests (5 complete user journeys)

### 6. Environment Setup (Docker)
**File:** [pm_tool_environment_setup.md](pm_tool_environment_setup.md)
- Two environments: Local Dev (Docker) + Production (Supabase Cloud + Vercel)
- Local Supabase Docker setup via CLI (ports 54321-54326)
- Supabase Studio (localhost:54323) and Inbucket email testing (localhost:54324)
- `supabase/config.toml` configuration
- Production setup: Supabase Cloud + Vercel env vars
- Package.json convenience scripts
- `.env.local` and `.env.production` templates
- Daily development workflow
- Deployment workflow
- Troubleshooting guide

### 7. Implementation Tracker
**File:** [pm_tool_implementation_tracker.md](pm_tool_implementation_tracker.md)
- Phase-by-phase checkbox tracker for all 9 phases
- Every file and task as an individual checkbox
- Verification checklist after each phase
- Summary table with phase status

---

## Quick Reference

### Build Order
1. Foundation (scaffold, deps, auth middleware, layout shell)
2. Database (migrations, RLS, triggers, storage bucket, type generation)
3. Auth & Onboarding (signup/login/forgot-password, org creation, `getCurrentOrganization()`)
4. Projects (CRUD, list, detail, permission helpers, `logActivity()`)
5. Tasks (CRUD, detail page, `createNotification()` stub)
6. Kanban Board (dnd-kit, position persistence, optimistic updates)
7. Collaboration (comments, attachments, activity timeline)
8. Notifications & Dashboard (notification UI + badge, 5 dashboard widgets)
9. Hardening (loading/empty/error states, team page, settings, responsive, deploy)

### Server Action Pipeline
```
Zod validate -> getCurrentOrganization() -> permission check -> DB operation -> logActivity() -> createNotification() -> revalidatePath() -> return {data} or {error}
```

### Key Files
| File | Role |
|------|------|
| `src/lib/supabase/server.ts` | Server-side Supabase client (every query/action) |
| `src/lib/supabase/client.ts` | Browser Supabase client (realtime, client components) |
| `src/lib/auth/get-organization.ts` | `getCurrentOrganization()` — central auth context |
| `src/lib/permissions/index.ts` | All `can*` permission functions |
| `src/middleware.ts` | Route protection |
| `src/types/database.types.ts` | Auto-generated Supabase types |

### Folder Structure
```
src/
  app/           → Routes only (thin pages)
  components/    → ui/ (shadcn), shared/ (EmptyState, ConfirmDialog), layout/ (Sidebar, Header)
  features/      → auth/, organizations/, projects/, tasks/, comments/, attachments/, notifications/, activity/, dashboard/
  lib/           → supabase/, auth/, permissions/, utils/
  hooks/         → Realtime hooks
  types/         → Global types
  constants/     → Enums, label maps
```

### Feature Folder Convention
```
features/{name}/
  schemas.ts     → Zod schemas
  actions.ts     → Server actions
  queries.ts     → Supabase queries
  components/    → Feature UI components
```

### Do NOT Add (MVP Exclusions)
- Microservices, Express, NestJS
- Redux, GraphQL, event bus
- Gantt charts, time tracking, subtasks
- Automation rules, AI features
- GitHub/GitLab integration
- Custom websocket server
- Multilevel workflow builders

---

## Environments

| Environment | Supabase | App | Purpose |
|-------------|----------|-----|---------|
| **Local Dev** | Docker containers via `pnpm supabase start` | `pnpm dev` (localhost:3000) | Daily development |
| **Production** | Supabase Cloud | Vercel | Live deployment |

**Local URLs:**
- App: `http://localhost:3000`
- Supabase API: `http://127.0.0.1:54321`
- Supabase Studio: `http://127.0.0.1:54323`
- Email Testing (Inbucket): `http://127.0.0.1:54324`

See [pm_tool_environment_setup.md](pm_tool_environment_setup.md) for full setup guide.

---

## Commands

```bash
# Development
pnpm dev                    # Start Next.js dev server
pnpm build                  # Production build
pnpm lint                   # Lint check

# Supabase (Docker)
pnpm supabase start         # Start local Supabase containers
pnpm supabase stop          # Stop containers (preserves data)
pnpm supabase stop --no-backup  # Stop and reset all data
pnpm supabase status        # View container status
pnpm supabase db push       # Apply migrations to local DB
pnpm supabase db reset      # Reset DB + re-apply all migrations
pnpm supabase db shell      # Connect to local PostgreSQL
pnpm supabase gen types typescript --local > src/types/database.types.ts  # Regenerate types

# Production
pnpm supabase link --project-ref <ref>  # Link to cloud project
pnpm supabase db push                   # Push migrations to production

# Testing
pnpm test                   # Run unit/integration tests (Vitest)
pnpm test:e2e               # Run E2E tests (Playwright, if configured)
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=       # Server-only! Never expose to client
NEXT_PUBLIC_APP_URL=             # App URL (http://localhost:3000 for dev)
```
