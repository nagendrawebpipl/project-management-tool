-- Helper function to check organization membership
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = org_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Organizations Policies
CREATE POLICY "Organizations are viewable by members" ON organizations
    FOR SELECT TO authenticated USING (is_org_member(id));

CREATE POLICY "Owners can update their organization" ON organizations
    FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Users can create organizations" ON organizations
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

-- Organization Members Policies
CREATE POLICY "Members can view other members in their organization" ON organization_members
    FOR SELECT TO authenticated USING (is_org_member(organization_id));

-- Projects Policies
CREATE POLICY "Projects are viewable by organization members" ON projects
    FOR SELECT TO authenticated USING (is_org_member(organization_id));

CREATE POLICY "Organization members can manage projects" ON projects
    FOR ALL TO authenticated USING (is_org_member(organization_id));

-- Project Members Policies
CREATE POLICY "Project members are viewable by organization members" ON project_members
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_members.project_id
            AND is_org_member(projects.organization_id)
        )
    );

-- Tasks Policies
CREATE POLICY "Tasks are viewable by organization members" ON tasks
    FOR SELECT TO authenticated USING (is_org_member(organization_id));

CREATE POLICY "Organization members can manage tasks" ON tasks
    FOR ALL TO authenticated USING (is_org_member(organization_id));

-- Task Comments Policies
CREATE POLICY "Comments are viewable by organization members" ON task_comments
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = task_comments.task_id
            AND is_org_member(tasks.organization_id)
        )
    );

CREATE POLICY "Users can insert their own comments" ON task_comments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON task_comments
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Task Attachments Policies
CREATE POLICY "Attachments are viewable by organization members" ON task_attachments
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = task_attachments.task_id
            AND is_org_member(tasks.organization_id)
        )
    );

CREATE POLICY "Users can insert their own attachments" ON task_attachments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Activity Logs Policies
CREATE POLICY "Activity logs are viewable by organization members" ON activity_logs
    FOR SELECT TO authenticated USING (is_org_member(organization_id));
