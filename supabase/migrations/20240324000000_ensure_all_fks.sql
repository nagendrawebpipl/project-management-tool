-- Safety migration to ensure ALL tables have the required foreign key relationships to public.profiles
-- This addresses the "Could not find a relationship" errors in environments where some migrations might have been skipped.

-- 1. Projects
ALTER TABLE IF EXISTS public.projects 
  DROP CONSTRAINT IF EXISTS projects_created_by_fkey,
  ADD CONSTRAINT projects_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Tasks (Assignee and Reporter)
ALTER TABLE IF EXISTS public.tasks
  DROP CONSTRAINT IF EXISTS tasks_assignee_id_fkey,
  ADD CONSTRAINT tasks_assignee_id_fkey 
  FOREIGN KEY (assignee_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.tasks
  DROP CONSTRAINT IF EXISTS tasks_reporter_id_fkey,
  ADD CONSTRAINT tasks_reporter_id_fkey 
  FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Project Members
ALTER TABLE IF EXISTS public.project_members
  DROP CONSTRAINT IF EXISTS project_members_user_id_fkey,
  DROP CONSTRAINT IF EXISTS fk_project_members_profiles,
  ADD CONSTRAINT project_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. Organization Members
ALTER TABLE IF EXISTS public.organization_members
  DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey,
  DROP CONSTRAINT IF EXISTS fk_organization_members_profiles,
  ADD CONSTRAINT organization_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 5. Activity Logs
ALTER TABLE IF EXISTS public.activity_logs
  DROP CONSTRAINT IF EXISTS activity_logs_actor_id_fkey,
  DROP CONSTRAINT IF EXISTS fk_activity_logs_profiles,
  ADD CONSTRAINT activity_logs_actor_id_fkey 
  FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 6. Task Comments
ALTER TABLE IF EXISTS public.task_comments
  DROP CONSTRAINT IF EXISTS task_comments_user_id_fkey,
  DROP CONSTRAINT IF EXISTS fk_task_comments_profiles,
  ADD CONSTRAINT task_comments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 7. Task Attachments
ALTER TABLE IF EXISTS public.task_attachments
  DROP CONSTRAINT IF EXISTS task_attachments_uploaded_by_fkey,
  DROP CONSTRAINT IF EXISTS fk_task_attachments_profiles,
  ADD CONSTRAINT task_attachments_uploaded_by_fkey 
  FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 8. Notifications
ALTER TABLE IF EXISTS public.notifications
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey,
  DROP CONSTRAINT IF EXISTS fk_notifications_profiles,
  ADD CONSTRAINT notifications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
