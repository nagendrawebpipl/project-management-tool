-- Add explicit foreign key relationship from organization_members to profiles
-- This helps PostgREST understand the join and avoids cache/ambiguity errors
ALTER TABLE public.organization_members
ADD CONSTRAINT fk_organization_members_profiles
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Also add to project_members for consistency and to avoid similar issues later
ALTER TABLE public.project_members
ADD CONSTRAINT fk_project_members_profiles
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Add to other tables that reference auth.users but should join with profiles
ALTER TABLE public.tasks
ADD CONSTRAINT fk_tasks_assignee_profiles
FOREIGN KEY (assignee_id) REFERENCES public.profiles(id)
ON DELETE SET NULL;

ALTER TABLE public.tasks
ADD CONSTRAINT fk_tasks_reporter_profiles
FOREIGN KEY (reporter_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

ALTER TABLE public.task_comments
ADD CONSTRAINT fk_task_comments_profiles
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

ALTER TABLE public.task_attachments
ADD CONSTRAINT fk_task_attachments_profiles
FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id)
ON DELETE CASCADE;

ALTER TABLE public.activity_logs
ADD CONSTRAINT fk_activity_logs_profiles
FOREIGN KEY (actor_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

ALTER TABLE public.notifications
ADD CONSTRAINT fk_notifications_profiles
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;
