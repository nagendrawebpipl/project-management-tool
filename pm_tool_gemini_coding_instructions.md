# Gemini Coding Agent Instructions — Project Management Tool MVP

You are Antigravity, the coding agent responsible for implementing a production-ready MVP of a project management tool for a software company.

Your goal is to build a clean, maintainable, scalable MVP using:

- Next.js (App Router)
- TypeScript
- Supabase (Auth, Postgres, Storage, Realtime)
- Vercel
- Tailwind CSS
- shadcn/ui

Do **not** introduce unnecessary complexity.

The architecture is:

- **Next.js + Supabase only**
- no Express
- no NestJS
- no separate backend service
- no microservices for MVP
- modular monolith inside Next.js app

---

# 1. High-Level Product Goal

Build a collaborative project management web app where software teams can:

- create organizations
- invite team members
- create projects
- create and assign tasks
- manage tasks on a Kanban board
- comment on tasks
- upload attachments
- receive notifications
- view a simple dashboard

---

# 2. Non-Negotiable Engineering Principles

## Architecture

- Use a **feature-based modular structure**.
- Keep business logic close to feature modules, not scattered randomly.
- Keep shared utilities inside `lib/`.
- Keep UI components reusable and small.
- Use Server Components by default unless interactivity requires Client Components.

## Quality

- Use **TypeScript strictly**.
- Avoid `any` unless absolutely unavoidable.
- Use **Zod** for all input validation.
- Use **React Hook Form** for forms.
- Prefer composition over overly large components.
- Prefer small server actions and focused utility functions.

## Security

- Use **Supabase Auth**.
- Enforce **authorization server-side**, not just in UI.
- Use **RLS** in Supabase from the beginning.
- Never expose secrets to the client.
- Never use service role key in browser code.

## Maintainability

- Write code that is easy for another engineer to extend.
- Keep naming explicit and consistent.
- Avoid hidden coupling.
- Do not over-engineer for imaginary future scale.
- Start clean, modular, and simple.

---

# 3. Core Product Scope

Implement these modules only.

## Authentication
- sign up
- login
- logout
- forgot password
- protected routes

## Organization / Team
- create organization
- list members
- invite members
- role support

## Projects
- create/edit/archive project
- list projects
- project detail page

## Tasks
- create/edit/delete task
- assign task
- set priority
- set due date
- change status
- filter/search basic task views

## Kanban
- drag and drop task movement
- column ordering persistence

## Task Collaboration
- comments
- attachments
- activity log

## Notifications
- in-app notifications
- unread count

## Dashboard
- my tasks
- overdue tasks
- simple project/task summary widgets

---

# 4. Features That Must Not Be Added in MVP

Do not add these unless explicitly requested later:

- microservices
- custom websocket server
- Redux
- GraphQL
- event bus
- advanced analytics
- Gantt charts
- time tracking
- subtasks
- automation rules
- AI features
- GitHub integration
- multilevel workflow builders

---

# 5. Required Folder Structure

Use a clean feature-based structure:

```txt
src/
  app/
    (public)/
    (auth)/
    (dashboard)/
    api/
  components/
    ui/
    shared/
    layout/
    forms/
  features/
    auth/
    organizations/
    projects/
    tasks/
    comments/
    attachments/
    notifications/
    activity/
  lib/
    supabase/
    auth/
    permissions/
    utils/
    validations/
  hooks/
  types/
  constants/
```

### Rules

- shared primitives go in `components/ui`
- reusable domain UI goes in feature folders or `components/shared`
- feature-specific server actions live inside the relevant feature folder
- schema definitions live close to the feature
- permission helpers live in `lib/permissions`

---

# 6. App Routing Plan

Implement these routes:

## Public
- `/`
- `/login`
- `/signup`
- `/forgot-password`

## Protected
- `/dashboard`
- `/projects`
- `/projects/[projectId]`
- `/projects/[projectId]/board`
- `/projects/[projectId]/tasks/[taskId]`
- `/team`
- `/notifications`
- `/settings`

Use route groups and layout nesting properly.

---

# 7. UI and Design Rules

## Styling

- Use Tailwind CSS.
- Use shadcn/ui components where helpful.
- Build a clean professional dashboard style.
- Prefer clarity over decorative styling.
- Keep spacing, typography, borders, and shadows consistent.

## UX

- Every async action must show loading feedback.
- Every page should have proper empty states.
- Every form should have field-level validation messages.
- Use drawers/modals only where they improve speed and clarity.
- Board interactions should feel fast and responsive.

## Accessibility

- Use proper button labels
- use form labels
- use keyboard-friendly interactions where practical
- avoid inaccessible icon-only actions without tooltips/labels

---

# 8. Data Model Requirements

Implement the following database tables in Supabase.

## profiles
- id
- full_name
- avatar_url
- created_at
- updated_at

## organizations
- id
- name
- slug
- owner_id
- created_at
- updated_at

## organization_members
- id
- organization_id
- user_id
- role
- status
- joined_at

## projects
- id
- organization_id
- name
- description
- status
- start_date
- end_date
- created_by
- created_at
- updated_at

## project_members
- id
- project_id
- user_id
- role
- created_at

## tasks
- id
- organization_id
- project_id
- title
- description
- status
- priority
- assignee_id
- reporter_id
- due_date
- position
- created_at
- updated_at

## task_comments
- id
- task_id
- user_id
- content
- created_at
- updated_at
- deleted_at nullable

## task_attachments
- id
- task_id
- uploaded_by
- file_name
- file_path
- file_size
- mime_type
- created_at

## notifications
- id
- organization_id
- user_id
- type
- title
- body
- entity_type
- entity_id
- is_read
- created_at

## activity_logs
- id
- organization_id
- actor_id
- entity_type
- entity_id
- action
- metadata jsonb
- created_at

---

# 9. Database Rules

## Multi-tenancy

Every core entity must belong to an organization.

## RLS

Set up row-level security for all protected tables.

### Principle
A user should only read or write data for organizations they belong to, and only within their role permissions.

## Constraints

- add foreign keys
- add useful indexes
- use enums or constrained values when practical
- use timestamps consistently

---

# 10. Authentication Requirements

Use Supabase Auth with SSR-friendly setup.

## Must implement

- auth client helper for browser
- auth client helper for server
- middleware protection for app routes
- helper to retrieve current authenticated user
- helper to load organization membership context

## Rules

- use secure cookie-based session flow
- do not implement custom JWT auth
- do not build your own password logic

---

# 11. Server vs Client Component Rules

## Prefer Server Components for

- dashboard page shell
- project listing
- project detail initial data
- task detail initial data
- team page
- notifications page

## Use Client Components for

- Kanban board drag and drop
- inline form interactions
- modals/drawers
- task editor
- comments composer
- live notification badge

---

# 12. Mutation Strategy

## Use Server Actions for

- CRUD operations for projects/tasks/comments
- movement of tasks
- mark notifications as read

## Use Route Handlers for

- storage-related upload helpers
- webhooks

All mutations must validate input with Zod, authenticate user, and check permissions.

---

# 13. Realtime Rules

Use Supabase Realtime sparingly and intentionally for:
- comments on open task page
- board changes
- notification count refresh

---

# 14. Suggested Build Order

1. Foundation (scaffold, deps, auth middleware, layout shell)
2. Database (migrations, RLS, triggers, storage)
3. Authentication and onboarding
4. Projects
5. Tasks
6. Kanban board
7. Collaboration (comments, attachments, logs)
8. Notifications and dashboard
9. Hardening

---

# 15. Testing Expectations

Manually verify:
- auth flow
- protected routes
- project/task CRUD
- board movement
- comments/attachments

---

# 16. Code Style Expectations

- Use descriptive names
- Keep files reasonably small
- Prefer readable code
- Split large components
