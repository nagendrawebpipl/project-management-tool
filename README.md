# PM Tool MVP

A production-grade project management tool for software teams built with Next.js (App Router) and Supabase.

## 🚀 Features

- **Auth & Onboarding**: Email/password authentication with organization setup.
- **Projects**: Manage multiple projects with status tracking and search.
- **Tasks**: Full task management with priorities, assignees, and due dates.
- **Kanban Board**: Drag-and-drop task visualization using `@dnd-kit`.
- **Collaboration**: Task-level comments, file attachments, and a comprehensive activity timeline.
- **Dashboard**: High-level overview with widgets for your tasks, overdue items, status distribution, and recent activity.
- **Notifications**: Real-time in-app notifications with unread badges.
- **Team Management**: Invite and manage team members with roles (Owner, Admin, Manager, Member).
- **Hardening**: Loading skeletons, smooth error handling, and responsive design for mobile.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (Postgres + RLS)
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Forms**: React Hook Form + Zod
- **DND**: @dnd-kit

## 🏃 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- Supabase CLI (optional for local dev)

### Setup

1. **Clone & Install**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Database Setup**:
   If using local Supabase:
   ```bash
   pnpm supabase start
   pnpm supabase db push
   ```

4. **Run Development Server**:
   ```bash
   pnpm dev
   ```

## 🏗️ Deployment

Deploy to Vercel with the environment variables listed above. Ensure you update the Supabase Auth "Site URL" to your production domain.

## 📄 License

MIT
