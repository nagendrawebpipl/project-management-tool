-- Fix Projects -> Profiles relationship
ALTER TABLE public.projects 
  DROP CONSTRAINT IF EXISTS projects_created_by_fkey,
  ADD CONSTRAINT projects_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix Project Members -> Profiles relationship
ALTER TABLE public.project_members
  DROP CONSTRAINT IF EXISTS project_members_user_id_fkey,
  ADD CONSTRAINT project_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix Tasks -> Profiles relationship (Assignee)
ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS tasks_assignee_id_fkey,
  ADD CONSTRAINT tasks_assignee_id_fkey 
  FOREIGN KEY (assignee_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Fix Tasks -> Profiles relationship (Reporter)
ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS tasks_reporter_id_fkey,
  ADD CONSTRAINT tasks_reporter_id_fkey 
  FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix Activity Logs -> Profiles relationship
ALTER TABLE public.activity_logs
  DROP CONSTRAINT IF EXISTS activity_logs_actor_id_fkey,
  ADD CONSTRAINT activity_logs_actor_id_fkey 
  FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix Organization Members -> Profiles relationship
ALTER TABLE public.organization_members
  DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey,
  ADD CONSTRAINT organization_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
