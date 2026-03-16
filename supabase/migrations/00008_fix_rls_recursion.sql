-- HEAVY DUTY FIX FOR RLS RECURSION
-- This migration implements a pattern that provenly breaks infinite recursion in Supabase RLS.

-- 1. Create a "Security Definer" function to get the user's organizations
-- Running as SECURITY DEFINER means it runs as 'postgres', bypassing RLS on organization_members
CREATE OR REPLACE FUNCTION public.get_my_orgs()
RETURNS TABLE (org_id UUID) AS $$
BEGIN
  RETURN QUERY 
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = auth.uid() 
  AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop all conflicting policies
DROP POLICY IF EXISTS "Members can view other members in their organization" ON public.organization_members;
DROP POLICY IF EXISTS "Members can view own membership" ON public.organization_members;
DROP POLICY IF EXISTS "Members can view others in same org" ON public.organization_members;

-- 3. Create fresh, stable SELECT policies
-- Anyone can see their own membership
CREATE POLICY "Membership: view self" ON public.organization_members
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Members can see others in the same organization
-- This uses the get_my_orgs() function which doesn't trigger RLS on itself
CREATE POLICY "Membership: view fellows" ON public.organization_members
    FOR SELECT TO authenticated
    USING (organization_id IN (SELECT org_id FROM public.get_my_orgs()));

-- 4. Fix Organization Policies (also likely recursive)
DROP POLICY IF EXISTS "Organizations are viewable by members or owners" ON public.organizations;
CREATE POLICY "Organizations: view as member or owner" ON public.organizations
    FOR SELECT TO authenticated
    USING (id IN (SELECT org_id FROM public.get_my_orgs()) OR auth.uid() = owner_id);

-- 5. Fix Task/Project Policies to be more efficient
DROP POLICY IF EXISTS "Projects are viewable by organization members" ON public.projects;
CREATE POLICY "Projects: view as member" ON public.projects
    FOR SELECT TO authenticated
    USING (organization_id IN (SELECT org_id FROM public.get_my_orgs()));

DROP POLICY IF EXISTS "Tasks are viewable by organization members" ON public.tasks;
CREATE POLICY "Tasks: view as member" ON public.tasks
    FOR SELECT TO authenticated
    USING (organization_id IN (SELECT org_id FROM public.get_my_orgs()));

DROP POLICY IF EXISTS "Activity logs are viewable by organization members" ON public.activity_logs;
CREATE POLICY "Activity: view as member" ON public.activity_logs
    FOR SELECT TO authenticated
    USING (organization_id IN (SELECT org_id FROM public.get_my_orgs()));
