-- Helper function to check if user is admin or owner
CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = org_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
    AND organization_members.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organization Members Policies

-- 1. INSERT policy
-- Allow the organization owner to add the first member (usually themselves)
CREATE POLICY "Owners can add the first member" ON organization_members
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM organizations
            WHERE organizations.id = organization_id
            AND organizations.owner_id = auth.uid()
        )
    );

-- Allow admins and owners to add/invite other members
CREATE POLICY "Admins and owners can add members" ON organization_members
    FOR INSERT TO authenticated
    WITH CHECK (is_org_admin(organization_id));

-- 2. UPDATE policy
-- Allow admins and owners to update member roles/status
CREATE POLICY "Admins and owners can update members" ON organization_members
    FOR UPDATE TO authenticated
    USING (is_org_admin(organization_id));

-- 3. DELETE policy
-- Allow admins and owners to remove members
CREATE POLICY "Admins and owners can remove members" ON organization_members
    FOR DELETE TO authenticated
    USING (is_org_admin(organization_id));

-- Allow users to remove themselves (leave)
CREATE POLICY "Users can remove themselves" ON organization_members
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);
